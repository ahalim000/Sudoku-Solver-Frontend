// function fmt_grid(grid) {
//     let repr = "";

//     for (let i = 0; i < grid.length; i++) {
//         for (let j = 0; j < grid[i].length; j++) {
//             repr += grid[i][j].toString() + " ";
//             if ((j + 1) % 3 === 0 && j !== grid.length - 1) {
//                 repr += "| ";
//             }
//         }
//         repr += "\n"
//         if ((i + 1) % 3 === 0 && i !== grid.length - 1) {
//             repr += "----------------------\n";
//         }
//     }

//     return repr.trim();
// }

function check_row(puzzle, row_idx, val) {
    let row = puzzle[row_idx];
    for (let cur_val of row) {
        if (cur_val === val) {
            return false;
        }
    }
    return true;
}

function check_col(puzzle, col_idx, val) {
    for (let row of puzzle) {
        if (row[col_idx] === val) {
            return false;
        }
    }
    return true;
}

function check_sub_grid(puzzle, row_idx, col_idx, val) {
    let first_row = row_idx - row_idx % 3;
    let first_column = col_idx - col_idx % 3;
    for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
            if (puzzle[j + first_row][k + first_column] == val) {
                return false;
            }
        }
    }
    return true;
}

function solve_puzzle(puzzle, row_idx, col_idx) {
    // Check if we are out of the grid's bounds.
    //  Return true.
    if (row_idx > 8) {
        return true;
    }


    let next_row_idx = row_idx + Math.floor((col_idx + 1) / 9);
    let next_col_idx = (col_idx + 1) % 9;
    // Check if square already has a value.
    //  Return recursive call for square.
    if (puzzle[row_idx][col_idx] !== 0) {
        return solve_puzzle(puzzle, next_row_idx, next_col_idx);
    }

    for (let i = 1; i < 10; i++) {
        // Check the 3 failure conditions. If any one is met
        //  Try the next value (continue).
        if (
            !check_row(puzzle, row_idx, i) ||
            !check_col(puzzle, col_idx, i) ||
            !check_sub_grid(puzzle, row_idx, col_idx, i)
        ) {
            continue;
        }

        //  Else set cell to i and recurse to next cell to see 
        //  if there is a solution for the rest of the puzzle.
        // If there is a solution (returns true) return true
        puzzle[row_idx][col_idx] = i;

        if (solve_puzzle(puzzle, next_row_idx, next_col_idx)) {
            return true;
        }

        // Else set i to 0 and continue
        puzzle[row_idx][col_idx] = 0;
    }
    // There is no solution here so return false
    return false;
}

export { solve_puzzle };