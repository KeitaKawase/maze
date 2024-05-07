# models.py
from django.db import models
import json

class Maze(models.Model):
    title = models.CharField(max_length=100, default='Untitled Maze')
    width = models.IntegerField()
    height = models.IntegerField()
    drawing = models.TextField()  # JSONFieldが使えない場合、TextFieldで代用

    created_at = models.DateTimeField(auto_now_add=True)

    def set_drawing(self, drawing_data):
        """Drawing dataをJSON文字列として保存"""
        self.drawing = json.dumps(drawing_data)

    def get_drawing(self):
        """Drawing dataをオブジェクトとして取得"""
        return json.loads(self.drawing)

    def __str__(self):
        return f"{self.title} ({self.width}x{self.height})"
