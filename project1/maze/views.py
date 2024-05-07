from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import json
import logging
from .maze_views import make_maze_from_drawing
from .models import Maze

logger = logging.getLogger(__name__)

def home(request):
    if request.method == 'POST':
        width = request.POST.get('width')
        height = request.POST.get('height')
        return redirect('draw_maze', width=width, height=height)
    return render(request, 'maze/home.html')


def draw_maze(request, width, height):
    saved_mazes = Maze.objects.all().order_by('-created_at')
    context = {
        'width': width,
        'height': height,
        'saved_mazes': saved_mazes
    }
    return render(request, 'maze/draw_maze.html', context)


def generate_maze(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            title = data.get('title', 'Untitled Maze')
            saved_maze_id = data.get('savedMazeId', None)
            width = int(data.get('width', 0))
            height = int(data.get('height', 0))
            drawing = data.get('drawing', [])

            if saved_maze_id:
                try:
                    maze = Maze.objects.get(pk=saved_maze_id)
                    title = maze.title
                    width = maze.width
                    height = maze.height
                    drawing = json.loads(maze.drawing)
                except Maze.DoesNotExist:
                    logger.error(f"Maze with ID {saved_maze_id} not found.")
                    return JsonResponse({'error': f"Maze with ID {saved_maze_id} not found."}, status=404)
                except json.JSONDecodeError as e:
                    logger.error(f"Invalid JSON in saved drawing: {e}")
                    return JsonResponse({'error': f"Invalid JSON in saved drawing: {e}"}, status=400)
            else:
                new_maze = Maze(
                    title=title,
                    width=width,
                    height=height,
                    drawing=json.dumps(drawing)
                )
                new_maze.save()
                logger.info(f"New maze created with title: {title}")

            if width <= 0 or height <= 0 or not drawing:
                raise ValueError("Invalid maze dimensions or drawing data.")

            maze_data = make_maze_from_drawing(height, width, drawing)
            request.session['maze_data'] = maze_data
            request.session['maze_title'] = title

            return JsonResponse({'redirect_url': '/display/'})

        except ValueError as e:
            logger.error(f"ValueError: {e}")
            return JsonResponse({'error': str(e)}, status=400)

        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            return JsonResponse({'error': str(e)}, status=500)

    else:
        return JsonResponse({'error': 'Invalid HTTP method'}, status=405)


def display_maze(request):
    maze_data = request.session.get('maze_data', [])
    maze_title = request.session.get('maze_title', 'Untitled Maze')

    if not maze_data:
        return HttpResponse("No maze data available.", status=404)

    return render(request, 'maze/display_maze.html', {'maze': maze_data, 'title': maze_title})
