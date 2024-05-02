# maze/urls.py
from django.urls import path
from . import views
urlpatterns = [
    path('', views.home, name='home'),
    path('draw/<int:width>/<int:height>/', views.draw_maze, name='draw_maze'),
    path('generate/', views.generate_maze, name='generate_maze'),
    path('display/', views.display_maze, name='display_maze'),
    

]