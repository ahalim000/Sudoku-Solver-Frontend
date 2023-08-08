import styles from "@/components/sudoku_grid/SudokuGrid.module.css";
import { solve_puzzle } from "@/solver";
import { useState, useRef } from "react";
import _ from "lodash";
// import { nodeServerAppPaths } from "next/dist/build/webpack/plugins/pages-manifest-plugin";

export default function SudokuGrid() {
    let [puzzle, setPuzzle] = useState([
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
    ]);

    let [oldPuzzle, setOldPuzzle] = useState([
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
    ]);

    let [solved, setSolved] = useState(false);
    let inputRefs = useRef({});

    let handleInput = (row_idx, col_idx) => {
        return (event) => {
            let new_puzzle = _.cloneDeep(puzzle);
            new_puzzle[row_idx][col_idx] = event.target.value;

            if (event.target.value == "") {
                let prev_row_idx = row_idx - (col_idx == 0 ? 1 : 0);
                let prev_col_idx = (col_idx - 1 + 9) % 9;
                if (prev_row_idx >= 0) {
                    inputRefs.current[prev_row_idx][prev_col_idx].focus();
                }
            } else {
                let next_row_idx = row_idx + Math.floor((col_idx + 1) / 9);
                let next_col_idx = (col_idx + 1) % 9;
                if (next_row_idx < 9) {
                    inputRefs.current[next_row_idx][next_col_idx].focus();
                }
            }

            setPuzzle(new_puzzle);
        };
    };

    let handlePaste = (row_idx, col_idx) => {
        return (event) => {
            // Event data is multiple characters means pasted
            let new_puzzle = _.cloneDeep(puzzle);
            let paste_data = event.clipboardData
                .getData("text")
                .replace(/\s+/g, "");
            let cur_row = row_idx;
            let cur_col = col_idx;
            for (let chr of paste_data) {
                if (cur_row >= 9) {
                    break;
                }
                new_puzzle[cur_row][cur_col] = chr;
                cur_row = cur_row + Math.floor((cur_col + 1) / 9);
                cur_col = (cur_col + 1) % 9;
            }
            setPuzzle(new_puzzle);
        };
    };

    let handleSolve = () => {
        let parsed = [];

        for (let row of puzzle) {
            let parsed_row = [];
            for (let item of row) {
                parsed_row.push(parseInt(item || "0"));
            }
            parsed.push(parsed_row);
        }

        solve_puzzle(parsed, 0, 0);

        let new_puzzle = _.cloneDeep(puzzle);
        for (let row_idx = 0; row_idx < 9; row_idx++) {
            for (let col_idx = 0; col_idx < 9; col_idx++) {
                new_puzzle[row_idx][col_idx] =
                    parsed[row_idx][col_idx].toString();
            }
        }

        setOldPuzzle(_.cloneDeep(puzzle));
        setPuzzle(new_puzzle);
        setSolved(true);
    };

    let handleReset = () => {
        let old_puzzle_copy = _.cloneDeep(oldPuzzle);

        setPuzzle(old_puzzle_copy);
        setSolved(false);
    };

    let getColorClass = (row_idx, col_idx) => {
        if (
            solved &&
            (oldPuzzle[row_idx][col_idx] === "" ||
                oldPuzzle[row_idx][col_idx] === "0")
        ) {
            return "solved_cell";
        }
        return "";
    };

    let rows = [];
    for (let row_idx = 0; row_idx < 9; row_idx++) {
        let cells = [];
        for (let col_idx = 0; col_idx < 9; col_idx++) {
            let cell_class_name = "";
            if (col_idx === 0) {
                cell_class_name = "leftmost_cell";
            } else if ((col_idx + 1) % 3 === 0) {
                cell_class_name = "subgrid_border_cell";
            }

            let cell = (
                <input
                    type="text"
                    className={
                        _.get(styles, cell_class_name, "") +
                        " " +
                        _.get(styles, getColorClass(row_idx, col_idx), "")
                    }
                    autoComplete="off"
                    maxLength="1"
                    key={col_idx}
                    value={puzzle[row_idx][col_idx]}
                    onChange={handleInput(row_idx, col_idx)}
                    onPaste={handlePaste(row_idx, col_idx)}
                    disabled={solved}
                    ref={(el) =>
                        _.set(inputRefs.current, [row_idx, col_idx], el)
                    }
                ></input>
            );
            cells.push(cell);
        }

        let row_class_name = "";
        if (row_idx === 0) {
            row_class_name = "top_row";
        } else if ((row_idx + 1) % 3 === 0) {
            row_class_name = "subgrid_border_row";
        } else {
            row_class_name = "row";
        }

        let row = (
            <div className={styles[row_class_name]} key={row_idx}>
                {cells}
            </div>
        );
        rows.push(row);
    }

    return (
        <>
            <h1>Sudoku Solver</h1>
            <div className={styles.grid}>{rows}</div>
            <button
                className={styles.solve_button}
                type="submit"
                onClick={solved ? handleReset : handleSolve}
            >
                {solved ? "Reset" : "Solve!"}
            </button>
        </>
    );
}
