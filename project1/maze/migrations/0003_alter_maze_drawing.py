# Generated by Django 4.2 on 2024-05-07 01:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('maze', '0002_alter_maze_drawing'),
    ]

    operations = [
        migrations.AlterField(
            model_name='maze',
            name='drawing',
            field=models.TextField(),
        ),
    ]