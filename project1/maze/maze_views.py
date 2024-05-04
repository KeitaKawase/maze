import random

def show_maze(maze):
    """Prints the maze to the console."""
    for row in maze:
        print(''.join(row))

def get_cluster_index(i, cluster_index):
    """Find the root of the cluster."""
    if cluster_index[i] != i:
        cluster_index[i] = get_cluster_index(cluster_index[i], cluster_index)
    return cluster_index[i]

def connect(ci, cj, cluster_index):
    """Connect two clusters."""
    root_i = get_cluster_index(ci, cluster_index)
    root_j = get_cluster_index(cj, cluster_index)
    if root_i != root_j:
        cluster_index[root_j] = root_i

def break_wall(ri, ci, rj, cj, n, cluster_index, maze):
    """Breaks a wall between two cells if they are not in the same cluster."""
    i = ci + ri * n
    j = cj + rj * n
    root_i = get_cluster_index(i, cluster_index)
    root_j = get_cluster_index(j, cluster_index)
    if root_i != root_j:
        connect(root_i, root_j, cluster_index)
        if ci == cj:
            maze[ri*2+2][ci*2+1] = ' '
        else:
            maze[ri*2+1][ci*2+2] = ' '

def make_maze_from_drawing(m, n, drawing):
    """Creates a maze based on a given drawing."""
    maze = [['*'] * (2*n+1) for _ in range(2*m+1)]
    cluster_index = list(range(m * n))
    
    # Initialize all cells as walls.
    for r in range(m):
        for c in range(n):
            maze[2*r+1][2*c+1] = ' '

    # Process user drawing to create initial paths.
    for i in range(len(drawing)-1):
        x1, y1 = drawing[i]['x'], drawing[i]['y']
        x2, y2 = drawing[i+1]['x'], drawing[i+1]['y']
        break_wall(y1, x1, y2, x2, n, cluster_index, maze)

    # Add Start and Goal.
    maze[2*drawing[0]['y']+1][2*drawing[0]['x']+1] = 'S'
    maze[2*drawing[-1]['y']+1][2*drawing[-1]['x']+1] = 'G'

    # Add walls that are not in the initial drawing path.
    walls = []
    for r in range(m):
        for c in range(n):
            if r < m - 1:
                walls.append((r, c, r+1, c))
            if c < n - 1:
                walls.append((r, c, r, c+1))
    random.shuffle(walls)

    # Break additional walls to ensure all cells are reachable.
    for (r1, c1, r2, c2) in walls:
        break_wall(r1, c1, r2, c2, n, cluster_index, maze)

    show_maze(maze)
    return maze