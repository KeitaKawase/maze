from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import json
from .maze_views import make_maze_from_drawing
import logging
import json
from django.http import JsonResponse

def home(request):
    if request.method == 'POST':
        width = request.POST.get('width')
        height = request.POST.get('height')
        return redirect('draw_maze', width=width, height=height)
    return render(request, 'maze/home.html')

def draw_maze(request, width, height):
    context = {'width': width, 'height': height}
    return render(request, 'maze/draw_maze.html', context)

def generate_maze(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)
            title = data.get('title', 'Untitled Maze')  # Fetch title or set default
            print(f"Received Title: {title}")  # デバッグ用にタイトルを表示
            width = int(data.get('width', 0))
            height = int(data.get('height', 0))
            drawing = data.get('drawing', [])
            
            # Ensure all required fields are valid
            if width <= 0 or height <= 0 or not drawing:
                raise ValueError("Invalid maze dimensions or drawing data.")

            maze = make_maze_from_drawing(height, width, drawing)
            request.session['maze_data'] = maze
            request.session['maze_title'] = title  # Save the title

            return JsonResponse({'redirect_url': '/display/'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid HTTP method'}, status=405)


def display_maze(request):
    maze_data = request.session.get('maze_data', [])
    maze_title = request.session.get('maze_title', 'Untitled Maze')  # ここでタイトルを取得

    if not maze_data:
        return HttpResponse("No maze data available.", status=404)

    return render(request, 'maze/display_maze.html', {'maze': maze_data, 'title': maze_title})  # タイトルも渡す

