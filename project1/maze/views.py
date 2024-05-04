from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import json
from .maze_views import make_maze_from_drawing

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
        data = json.loads(request.body)
        width = int(data['width'])
        height = int(data['height'])
        drawing = data['drawing']
        maze = make_maze_from_drawing(height, width, drawing)
        request.session['maze_data'] = maze
        return JsonResponse({'redirect_url': '/display/'})
    else:
        return JsonResponse({'error': 'Invalid HTTP method'}, status=405)

def display_maze(request):
    maze_data = request.session.get('maze_data', [])
    if not maze_data:
        return HttpResponse("No maze data available.", status=404)
    return render(request, 'maze/display_maze.html', {'maze': maze_data})
