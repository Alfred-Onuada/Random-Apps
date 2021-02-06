// This code make the ai impossible to beat for the fun i'll be using the other code that you can actually win

var playerEvents = [];

function playerSelect() {
    
    var x = document.getElementById('optX');
    var o = document.getElementById('optO');

    var turnText = document.getElementById('turnText');

    turnText.innerHTML = 'Pick a side to begin.';

    x.addEventListener('click', xListener);
    playerEvents.push([x, xListener]);

    function xListener() {
        x.classList.add('choosen');
        o.removeEventListener('click', oListener);
        x.removeEventListener('click', xListener);

        gamePlay();
    }

    o.addEventListener('click', oListener);
    playerEvents.push([o, oListener]);

    function oListener() {
        o.classList.add('choosen');
        x.removeEventListener('click', xListener);
        o.removeEventListener('click', oListener);

        gamePlay();
    }

}

function optDown() {
    
    var reset = document.getElementById('optDownR');
    var resetText = document.getElementById('optDownRText');
    var boardHTML = document.getElementById('board');

    var cells = Array.from(document.querySelectorAll('#board div'));

    boardReset = ['', '', '', 
        '', '', '', 
        '', '', ''];

    function renderBoardReset() {
        boardReset.forEach((content, index) => {
            cells[index].innerHTML = content;
        });
    }

    function clearPlayerEvents() {
        playerEvents.forEach((content, index) => {
            content[0].removeEventListener('click', content[1]);
        });
    }

    var x = document.getElementById('optX');
    var o = document.getElementById('optO');

    reset.addEventListener('click', resetListener);

    function resetListener() {
        reset.classList.add('choosenAni');
        resetText.classList.add('cTextAni');

        setTimeout(() => {
            reset.classList.remove('choosenAni');
            resetText.classList.remove('cTextAni');
        }, 1010);
        
        x.classList.contains('choosen') ? x.classList.remove('choosen') : false;
        o.classList.contains('choosen') ? o.classList.remove('choosen') : false;
        clearPlayerEvents();

        boardHTML.removeEventListener('click', listener);
        renderBoardReset();
        playerSelect();
    }

}

var listener;

function gamePlay() {
    
    var user;
    var ai;

    var x = document.getElementById('optX');
    var o = document.getElementById('optO');

    var boardHTML = document.getElementById('board');
    var turnText = document.getElementById('turnText');

    x.classList.contains('choosen') ? [user, ai] = ['X', 'O'] : false;
    o.classList.contains('choosen') ? [user, ai] = ['O', 'X'] : false;

    var cells = Array.from(document.querySelectorAll('#board div'));

    board = ['', '', '', 
        '', '', '', 
        '', '', ''];

    var winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6], 
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function checkTurn(x) {

        turn = x;
        turn = 'your' ? turnText.innerHTML = `It's ${turn} turn!` : turnText.innerHTML = `It's ${turn} turn!`;

    }

    function renderBoard() {
        board.forEach((content, index) => {
            cells[index].innerHTML = content;
        });
    }

    function checkWinner(x) {
        
        turn = x;
        win = 0;

        winningCombos.forEach((content, index) => {
            board[content[0]] && board[content[0]] == board[content[1]] && board[content[0]] == board[content[2]] ? win = 1 : false;
        });

    }

    function declareWinner(x) {

        turn = x;
        turnText.innerHTML = `${turn} wins!`;

    }

    function checkTie() {
        
        tie = 0
        board.includes('') ? false : tie = 1;

        tie == 1 ? declareTie() : false;

    }

    function declareTie() {

        turnText.innerHTML = "It's a Tie!";

    }

    function render() {
        
        user == 'X' ? userPlays() : aiPlays();

        function userPlays() {
            let turn = "your";
            checkTurn(turn);

            boardHTML.addEventListener('click', boardListenerUser);
            function boardListenerUser(cell) {
                let cellid = cells.findIndex((x) => {
                    return x === cell.target;
                });
                board[cellid] == '' ? [
                    board[cellid] = user,
                    boardHTML.removeEventListener('click', boardListenerUser),
                    renderBoard(),
                    checkWinner(user),
                    win == 1 ? declareWinner(user) : [
                        checkTie(),
                        setTimeout(() => {
                            board.includes('') ?
                                aiPlays()
                            : false;
                        }, 50)]
                ] : false ;
            };
            listener = boardListenerUser;
        }
        
        function aiPlays() {
            let turn = "my";
            checkTurn(turn)

            setTimeout(() => {
                
                function aiLogic() {

                    // write a function that you can call for the possible blocks etc to avoid doing it all the time

                    function checkMove() {

                        var defend;

                        var userMoves = [];
                        var possibleBlocks = [];
                        var narrowedPossibility = [];

                        board.forEach((content, index) => {
                            content == user ? userMoves.push(index) : false;
                        });

                        userMoves.forEach((ucontent, uindex) => {
                            winningCombos.forEach((content, index) => {
                                board[content[0]] == ai || board[content[1]] == ai || board[content[2]] == ai ? false : [
                                    ucontent == content[0] || ucontent == content[1] || ucontent == content[2] ? possibleBlocks.push(index) : false,
                                ];
                            });
                        });

                        possibleBlocks.forEach((content, index) => {
                            (possibleBlocks.filter(test => test == content).length) >= 2 && narrowedPossibility.lastIndexOf(content) == -1 ? narrowedPossibility.push(content) : false;
                        });

                        var aiMoves = [];
                        var aiPossibleBlocks = [];
                        var aiNarrowedPossibility = [];

                        board.forEach((content, index) => {
                            content == ai ? aiMoves.push(index) : false;
                        });

                        aiMoves.forEach((aicontent, aiindex) => {
                            winningCombos.forEach((content, index) => {
                                board[content[0]] == user || board[content[1]] == user || board[content[2]] == user ? false : [
                                    aicontent == content[0] || aicontent == content[1] || aicontent == content[2] ? aiPossibleBlocks.push(index) : false,
                                ];
                            });
                        });

                        aiPossibleBlocks.forEach((content, index) => {
                            (aiPossibleBlocks.filter(test => test == content).length) >= 2 && narrowedPossibility.lastIndexOf(content) == -1 ? aiNarrowedPossibility.push(content) : false;
                        });

                        aiNarrowedPossibility.length == 0 ? [
                            narrowedPossibility.length == 0 ? [
                                aiPossibleBlocks.length == 0 ? [
                                    possibleBlocks.length == 0 ? [
                                        defend = 0,
                                    ] : defend = 1,
                                ] : defend = 0,
                            ] : defend = 1,
                        ] : defend = 0;

                        return defend

                    }

                    defend = checkMove();
                    
                    function defensive() {
                        
                        var userMoves = [];
                        var possibleBlocks = [];
                        var narrowedPossibility = [];

                        board.forEach((content, index) => {
                            content == user ? userMoves.push(index) : false;
                        });

                        userMoves.sort(() => 0.5 - Math.random());

                        userMoves.forEach((ucontent, uindex) => {
                            winningCombos.forEach((content, index) => {
                                board[content[0]] == ai || board[content[1]] == ai || board[content[2]] == ai ? false : [
                                    ucontent == content[0] || ucontent == content[1] || ucontent == content[2] ? possibleBlocks.push(index) : false,
                                ];
                            });
                        });

                        possibleBlocks.sort(() => 0.5 - Math.random());

                        possibleBlocks.forEach((content, index) => {
                            (possibleBlocks.filter(test => test == content).length) >= 2 && narrowedPossibility.lastIndexOf(content) == -1 ? narrowedPossibility.push(content) : false;
                        });

                        narrowedPossibility.sort(() => 0.5 - Math.random());

                        played = 0;
                        
                        narrowedPossibility.length == 0 ? [
                            possibleBlocks.length == 0 ? false : [

                                userMoves.length == 1 ? [
                                    userMoves[0] == 4 ? [
                                        counterMoves = [0, 2, 6, 8],
                                        counterMoves.forEach((content, index) => {
                                            played == 1 ? false : [
                                                board[content] == '' ? [
                                                    board[content] = ai,
                                                    played = 1,
                                                    renderBoard(),
                                                    checkWinner(ai),
                                                    win == 1 ? declareWinner(ai) : [
                                                        checkTie(),
                                                        board.includes('') ? userPlays() : false,
                                                    ]
                                                ] : false,
                                            ]
                                        })
                                    ] : [
                                        board[4] == '' ? [
                                            board[4] = ai,
                                            played = 1,
                                            renderBoard(),
                                            checkWinner(ai),
                                            win == 1 ? declareWinner(ai) : [
                                                checkTie(),
                                                board.includes('') ? userPlays() : false
                                            ]
                                        ] : false,
                                    ],
                                ] : false,

                                possibleBlocks.forEach((content, index) => {
                                    played == 1 ? false : [
                                        board[winningCombos[content][0]] == '' ? [
                                            board[winningCombos[content][0]] = ai,
                                            played = 1,
                                            renderBoard(),
                                            checkWinner(ai),
                                            win == 1 ? declareWinner(ai) : [
                                                checkTie(),
                                                board.includes('') ? userPlays() : false
                                            ]
                                        ] : board[winningCombos[content][1]] == '' ? [
                                            board[winningCombos[content][1]] = ai,
                                            played = 1,
                                            renderBoard(),
                                            checkWinner(ai),
                                            win == 1 ? declareWinner(ai) : [
                                                checkTie(),
                                                board.includes('') ? userPlays() : false
                                            ]
                                        ] : board[winningCombos[content][2]] == '' ? [
                                            board[winningCombos[content][2]] = ai,
                                            played = 1,
                                            renderBoard(),
                                            checkWinner(ai),
                                            win == 1 ? declareWinner(ai) : [
                                                checkTie(),
                                                board.includes('') ? userPlays() : false
                                            ]
                                        ] : false
                                    ];
                                })
                            ]
                        ] : [
                            trials = 0,
                            possibleTrials = narrowedPossibility.length,
                            
                            narrowedPossibility.forEach((content, index) => {
                                trials++;
                                played == 1 ? false : [
                                    board[winningCombos[content][0]] == user && board[winningCombos[content][0]] == board[winningCombos[content][1]] && board[winningCombos[content][2]] == '' ? [
                                        board[winningCombos[content][2]] = ai,
                                        played = 1,
                                        renderBoard(),
                                        checkWinner(ai),
                                        win == 1 ? declareWinner(ai) : [
                                            checkTie(),
                                            board.includes('') ? userPlays() : false
                                        ]
                                    ] : board[winningCombos[content][0]] == user && board[winningCombos[content][0]] == board[winningCombos[content][2]] && board[winningCombos[content][1]] == '' ? [
                                        board[winningCombos[content][1]] = ai,
                                        played = 1,
                                        renderBoard(),
                                        checkWinner(ai),
                                        win == 1 ? declareWinner(ai) : [
                                            checkTie(),
                                            board.includes('') ? userPlays() : false
                                        ]
                                    ] : board[winningCombos[content][1]] == user && board[winningCombos[content][1]] == board[winningCombos[content][0]] && board[winningCombos[content][2]] == '' ? [
                                        board[winningCombos[content][2]] = ai,
                                        played = 1,
                                        renderBoard(),
                                        checkWinner(ai),
                                        win == 1 ? declareWinner(ai) : [
                                            checkTie(),
                                            board.includes('') ? userPlays() : false
                                        ]
                                    ] : board[winningCombos[content][1]] == user && board[winningCombos[content][1]] == board[winningCombos[content][2]] && board[winningCombos[content][0]] == '' ? [
                                        board[winningCombos[content][0]] = ai,
                                        played = 1,
                                        renderBoard(),
                                        checkWinner(ai),
                                        win == 1 ? declareWinner(ai) : [
                                            checkTie(),
                                            board.includes('') ? userPlays() : false
                                        ]
                                    ] : board[winningCombos[content][2]] == user && board[winningCombos[content][2]] == board[winningCombos[content][1]] && board[winningCombos[content][0]] == '' ? [
                                        board[winningCombos[content][0]] = ai,
                                        played = 1,
                                        renderBoard(),
                                        checkWinner(ai),
                                        win == 1 ? declareWinner(ai) : [
                                            checkTie(),
                                            board.includes('') ? userPlays() : false
                                        ]
                                    ] : board[winningCombos[content][2]] == user && board[winningCombos[content][2]] == board[winningCombos[content][0]] && board[winningCombos[content][1]] == '' ? [
                                        board[winningCombos[content][1]] = ai,
                                        played = 1,
                                        renderBoard(),
                                        checkWinner(ai),
                                        win == 1 ? declareWinner(ai) : [
                                            checkTie(),
                                            board.includes('') ? userPlays() : false
                                        ]
                                    ] : false,
                                ];
                            })
                        ];

                    }

                    function offensive() {
                        
                        var aiMoves = [];
                        var aiPossibleBlocks = [];
                        var aiNarrowedPossibility = [];

                        board.forEach((content, index) => {
                            content == ai ? aiMoves.push(index) : false;
                        });

                        aiMoves.sort(() => 0.5 - Math.random());

                        aiMoves.forEach((ucontent, uindex) => {
                            winningCombos.forEach((content, index) => {
                                board[content[0]] == user || board[content[1]] == user || board[content[2]] == user ? false : [
                                    ucontent == content[0] || ucontent == content[1] || ucontent == content[2] ? aiPossibleBlocks.push(index) : false,
                                ];
                            });
                        });

                        aiPossibleBlocks.sort(() => 0.5 - Math.random());

                        aiPossibleBlocks.forEach((content, index) => {
                            (aiPossibleBlocks.filter(test => test == content).length) >= 2 && aiNarrowedPossibility.lastIndexOf(content) == -1 ? aiNarrowedPossibility.push(content) : false;
                        });

                        aiNarrowedPossibility.sort(() => 0.5 - Math.random());

                        played = 0;
                        
                        aiNarrowedPossibility.length == 0 ? [
                            aiPossibleBlocks.length == 0 ? [
                                id = -1,
                                board.forEach((content, index) => {
                                    id == -1 ? [
                                        content == '' ? id = index : false
                                    ] : false
                                }),
                                board[id] = ai,
                                played = 1,
                                renderBoard(),
                                checkWinner(ai),
                                win == 1 ? declareWinner(ai) : [
                                    checkTie(),
                                    board.includes('') ? userPlays() : false
                                ]
                            ] : [
                                aiPossibleBlocks.forEach((content, index) => {
                                    played == 1 ? false : [
                                        board[winningCombos[content][0]] == '' ? [
                                            board[winningCombos[content][0]] = ai,
                                            played = 1,
                                            renderBoard(),
                                            checkWinner(ai),
                                            win == 1 ? declareWinner(ai) : [
                                                checkTie(),
                                                board.includes('') ? userPlays() : false
                                            ]
                                        ] : board[winningCombos[content][1]] == '' ? [
                                            board[winningCombos[content][1]] = ai,
                                            played = 1,
                                            renderBoard(),
                                            checkWinner(ai),
                                            win == 1 ? declareWinner(ai) : [
                                                checkTie(),
                                                board.includes('') ? userPlays() : false
                                            ]
                                        ] : board[winningCombos[content][2]] == '' ? [
                                            board[winningCombos[content][2]] = ai,
                                            played = 1,
                                            renderBoard(),
                                            checkWinner(ai),
                                            win == 1 ? declareWinner(ai) : [
                                                checkTie(),
                                                board.includes('') ? userPlays() : false
                                            ]
                                        ] : false
                                    ];
                                })
                            ]
                        ] : [
                            trials = 0,
                            possibleTrials = aiNarrowedPossibility.length,
                            
                            aiNarrowedPossibility.forEach((content, index) => {
                                trials++;
                                played == 1 ? false : [
                                    board[winningCombos[content][0]] == ai && board[winningCombos[content][0]] == board[winningCombos[content][1]] && board[winningCombos[content][2]] == '' ? [
                                        board[winningCombos[content][2]] = ai,
                                        played = 1,
                                        renderBoard(),
                                        checkWinner(ai),
                                        win == 1 ? declareWinner(ai) : [
                                            checkTie(),
                                            board.includes('') ? userPlays() : false
                                        ]
                                    ] : board[winningCombos[content][0]] == ai && board[winningCombos[content][0]] == board[winningCombos[content][2]] && board[winningCombos[content][1]] == '' ? [
                                        board[winningCombos[content][1]] = ai,
                                        played = 1,
                                        renderBoard(),
                                        checkWinner(ai),
                                        win == 1 ? declareWinner(ai) : [
                                            checkTie(),
                                            board.includes('') ? userPlays() : false
                                        ]
                                    ] : board[winningCombos[content][1]] == ai && board[winningCombos[content][1]] == board[winningCombos[content][0]] && board[winningCombos[content][2]] == '' ? [
                                        board[winningCombos[content][2]] = ai,
                                        played = 1,
                                        renderBoard(),
                                        checkWinner(ai),
                                        win == 1 ? declareWinner(ai) : [
                                            checkTie(),
                                            board.includes('') ? userPlays() : false
                                        ]
                                    ] : board[winningCombos[content][1]] == ai && board[winningCombos[content][1]] == board[winningCombos[content][2]] && board[winningCombos[content][0]] == '' ? [
                                        board[winningCombos[content][0]] = ai,
                                        played = 1,
                                        renderBoard(),
                                        checkWinner(ai),
                                        win == 1 ? declareWinner(ai) : [
                                            checkTie(),
                                            board.includes('') ? userPlays() : false
                                        ]
                                    ] : board[winningCombos[content][2]] == ai && board[winningCombos[content][2]] == board[winningCombos[content][1]] && board[winningCombos[content][0]] == '' ? [
                                        board[winningCombos[content][0]] = ai,
                                        played = 1,
                                        renderBoard(),
                                        checkWinner(ai),
                                        win == 1 ? declareWinner(ai) : [
                                            checkTie(),
                                            board.includes('') ? userPlays() : false
                                        ]
                                    ] : board[winningCombos[content][2]] == ai && board[winningCombos[content][2]] == board[winningCombos[content][0]] && board[winningCombos[content][1]] == '' ? [
                                        board[winningCombos[content][1]] = ai,
                                        played = 1,
                                        renderBoard(),
                                        checkWinner(ai),
                                        win == 1 ? declareWinner(ai) : [
                                            checkTie(),
                                            board.includes('') ? userPlays() : false
                                        ]
                                    ] : false,
                                ];
                            }),
                        ]

                    }

                    defend == 0 ? offensive() : defensive();

                }
                aiLogic();

            }, 200);
        }

    }

    render();

}

window.addEventListener('load', () => {
    playerSelect();
    optDown();
})