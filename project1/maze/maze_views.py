import random

def show_maze(maze):
    print()
    for row in maze:
        print(" "+ "".join(row))

def make_maze_from_drawing(m, n, drawing):
    maze = [['*'] * (2*n+1) for _ in range(2*m+1)]
    cluster_index = [r * n + c for r in range(m) for c in range(n)]
    
    def get_cluster_index(i):
        if cluster_index[i] != i:
            cluster_index[i] = get_cluster_index(cluster_index[i])
        return cluster_index[i]
    
    def connect(i, j):
        root_i = get_cluster_index(i)
        root_j = get_cluster_index(j)
        if root_i != root_j:
            cluster_index[root_j] = root_i

    # ユーザーの絵を基に迷路の通路を作成
    for y in range(m):
        for x in range(n):
            if drawing[y][x] == 0:
                maze[2*y+1][2*x+1] = ' '
                if y > 0 and drawing[y-1][x] == 0:
                    connect(y * n + x, (y-1) * n + x)
                if x > 0 and drawing[y][x-1] == 0:
                    connect(y * n + x, y * n + x - 1)

    # 迷路の壁を壊す
    walls = []
    for y in range(m):
        for x in range(n):
            if y < m - 1:  # Vertical walls
                walls.append(((2*y+2, 2*x+1), y*n+x, (y+1)*n+x))
            if x < n - 1:  # Horizontal walls
                walls.append(((2*y+1, 2*x+2), y*n+x, y*n+x+1))

    random.shuffle(walls)
    for (wy, wx), i, j in walls:
        if get_cluster_index(i) != get_cluster_index(j):
            maze[wy][wx] = ' '
            connect(i, j)
    
    show_maze(maze)

    return maze
