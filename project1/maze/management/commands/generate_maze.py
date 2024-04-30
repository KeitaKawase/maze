from django.core.management.base import BaseCommand
import random

class Command(BaseCommand):
    help = 'Generate a maze'

    def add_arguments(self, parser):
        parser.add_argument('width', nargs='?', type=int, default=10)
        parser.add_argument('height', nargs='?', type=int, default=20)

    def handle(self, *args, **options):
        w = options['width']
        h = options['height']
        self.make_maze(w, h)

    def show_maze(self, maze):
        print()
        for row in maze:
            print(" "+ "".join(row))

    def get_cluster_index(self, i, cluster_index):
        while cluster_index[i] != i:
            i = cluster_index[i]
        return i

    def connect(self, ci, cj, cluster_index):
        if ci > cj:
            ci, cj = cj, ci
        cluster_index[cj] = ci

    def break_wall(self, w, n, cluster_index, maze):
        ri, ci, rj, cj = w
        i = ci + ri * n
        j = cj + rj * n
        cli = self.get_cluster_index(i, cluster_index)
        clj = self.get_cluster_index(j, cluster_index)
        if cli == clj:
            return
        self.connect(cli, clj, cluster_index)
        if ci == cj:
            maze[ri*2+2][ci*2+1] = ' '
        else:
            maze[ri*2+1][ci*2+2] = ' '

    def check_finish(self, cluster_index):
        for i in range(len(cluster_index)):
            if self.get_cluster_index(i, cluster_index) != 0:
                return False
        return True

    def make_maze(self, m, n):
        maze = [['*']*(2*n+1) for i in range(2*m+1)]
        walls = []
        for r in range(m):
            for c in range(n):
                maze[2*r+1][2*c+1] = ' '
                if r != m-1:
                    walls.append([r, c, r+1, c])
                if c != n-1:
                    walls.append([r, c, r, c+1])
        cluster_index = [i for i in range(m*n)]
        random.shuffle(walls)
        for w in walls:
            self.break_wall(w, n, cluster_index, maze)
            if self.check_finish(cluster_index):
                break

        maze[2*m-1][1] = 'S'
        maze[1][2*n-1] = 'G'
        self.show_maze(maze)
