// Terminal Git interactif
document.addEventListener('DOMContentLoaded', function() {
    // Éléments du terminal
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const executeButton = document.getElementById('execute-command');
    const clearButton = document.getElementById('clearTerminal');
    const resetButton = document.getElementById('resetTerminal');
    const quickCommands = document.querySelectorAll('.quick-command');
    
    // État du terminal simulé
    let terminalState = {
        currentDir: '~/projet-git',
        repoInitialized: false,
        files: ['README.md', 'index.html', 'style.css'],
        stagedFiles: [],
        commits: [],
        currentBranch: 'main'
    };
    
    // Initialiser le terminal
    function initTerminal() {
        addOutputLine('🚀 Terminal Git interactif initialisé');
        addOutputLine('Tapez "help" pour voir les commandes disponibles');
        addOutputLine('Ou utilisez les boutons de commandes rapides ci-dessous');
        addOutputLine('');
    }
    
    // Ajouter une ligne de sortie
    function addOutputLine(text, isCommand = false) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        
        const prompt = document.createElement('span');
        prompt.className = 'terminal-prompt';
        prompt.textContent = isCommand ? '$' : '';
        
        const textSpan = document.createElement('span');
        textSpan.className = 'terminal-text';
        
        // Formater le texte avec des couleurs
        const formattedText = formatTerminalText(text);
        textSpan.innerHTML = formattedText;
        
        if (!isCommand) {
            line.appendChild(prompt);
        }
        line.appendChild(textSpan);
        
        terminalOutput.appendChild(line);
        
        // Scroll vers le bas
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
    
    // Formater le texte du terminal avec des couleurs
    function formatTerminalText(text) {
        return text
            .replace(/\[(.*?)\]/g, '<span style="color: #58a6ff;">[$1]</span>')
            .replace(/'(.*?)'/g, '<span style="color: #f0883e;">\'$1\'</span>')
            .replace(/"(.*?)"/g, '<span style="color: #f0883e;">"$1"</span>')
            .replace(/error:/gi, '<span style="color: #f85149; font-weight: bold;">error:</span>')
            .replace(/fatal:/gi, '<span style="color: #f85149; font-weight: bold;">fatal:</span>')
            .replace(/warning:/gi, '<span style="color: #f0883e; font-weight: bold;">warning:</span>')
            .replace(/git (init|add|commit|status|log|branch|checkout|merge|clone|pull|push|remote)/g, '<span style="color: #2ea44f; font-weight: bold;">$&</span>')
            .replace(/On branch (\w+)/g, '<span style="color: #bc8cff;">On branch <strong>$1</strong></span>')
            .replace(/commit [a-f0-9]+/g, '<span style="color: #58a6ff;">$&</span>')
            .replace(/\[.*?\]/g, '<span style="color: #8b949e;">$&</span>');
    }
    
    // Générer un ID de commit aléatoire
    function generateCommitId() {
        return Math.random().toString(16).substring(2, 10);
    }
    
    // Exécuter une commande
    function executeCommand(command) {
        if (!command.trim()) return;
        
        // Afficher la commande
        addOutputLine(command, true);
        
        // Traiter la commande
        const parts = command.trim().split(' ');
        const baseCommand = parts[0];
        const args = parts.slice(1);
        
        let output = '';
        
        switch(baseCommand) {
            case 'help':
                output = `
Commandes disponibles :
- <span style="color: #2ea44f;">help</span> : Affiche cette aide
- <span style="color: #2ea44f;">clear</span> : Efface le terminal
- <span style="color: #2ea44f;">git init</span> : Initialise un dépôt Git
- <span style="color: #2ea44f;">git status</span> : Affiche l'état du dépôt
- <span style="color: #2ea44f;">git add [fichier]</span> : Ajoute un fichier à l'index
- <span style="color: #2ea44f;">git add .</span> : Ajoute tous les fichiers
- <span style="color: #2ea44f;">git commit -m "message"</span> : Crée un commit
- <span style="color: #2ea44f;">git log</span> : Affiche l'historique
- <span style="color: #2ea44f;">git log --oneline</span> : Historique compact
- <span style="color: #2ea44f;">git branch</span> : Liste les branches
- <span style="color: #2ea44f;">git checkout -b [nom]</span> : Crée une branche
- <span style="color: #2ea44f;">ls</span> : Liste les fichiers
- <span style="color: #2ea44f;">touch [fichier]</span> : Crée un fichier
- <span style="color: #2ea44f;">mkdir [dossier]</span> : Crée un dossier
- <span style="color: #2ea44f;">pwd</span> : Affiche le dossier courant
                `;
                break;
                
            case 'clear':
                terminalOutput.innerHTML = '';
                return;
                
            case 'git':
                const gitCommand = parts[1];
                switch(gitCommand) {
                    case 'init':
                        if (terminalState.repoInitialized) {
                            output = 'Réinitialisé le dépôt Git existant dans ' + terminalState.currentDir;
                        } else {
                            terminalState.repoInitialized = true;
                            output = 'Initialized empty Git repository in ' + terminalState.currentDir + '/.git/';
                        }
                        break;
                        
                    case 'status':
                        if (!terminalState.repoInitialized) {
                            output = 'fatal: not a git repository (or any of the parent directories): .git';
                        } else {
                            output = `On branch ${terminalState.currentBranch}\n\n`;
                            
                            if (terminalState.stagedFiles.length > 0) {
                                output += 'Changes to be committed:\n';
                                output += '  (use "git restore --staged <file>..." to unstage)\n';
                                terminalState.stagedFiles.forEach(file => {
                                    output += `        new file:   ${file}\n`;
                                });
                                output += '\n';
                            }
                            
                            const unstagedFiles = terminalState.files.filter(f => !terminalState.stagedFiles.includes(f));
                            if (unstagedFiles.length > 0) {
                                output += 'Untracked files:\n';
                                output += '  (use "git add <file>..." to include in what will be committed)\n';
                                unstagedFiles.forEach(file => {
                                    output += `        ${file}\n`;
                                });
                            }
                            
                            if (terminalState.stagedFiles.length === 0 && unstagedFiles.length === 0) {
                                output += 'nothing to commit, working tree clean';
                            }
                        }
                        break;
                        
                    case 'add':
                        if (!terminalState.repoInitialized) {
                            output = 'fatal: not a git repository (or any of the parent directories): .git';
                        } else {
                            const target = parts[2];
                            if (target === '.') {
                                terminalState.files.forEach(file => {
                                    if (!terminalState.stagedFiles.includes(file)) {
                                        terminalState.stagedFiles.push(file);
                                    }
                                });
                                output = 'All files added to staging area.';
                            } else if (target) {
                                if (terminalState.files.includes(target)) {
                                    if (!terminalState.stagedFiles.includes(target)) {
                                        terminalState.stagedFiles.push(target);
                                        output = `File '${target}' added to staging area.`;
                                    } else {
                                        output = `File '${target}' is already staged.`;
                                    }
                                } else {
                                    output = `fatal: pathspec '${target}' did not match any files`;
                                }
                            } else {
                                output = 'usage: git add [--verbose | -v] [--dry-run | -n] [--force | -f] [--interactive | -i] [--patch | -p]\n' +
                                        '           [--edit | -e] [--[no-]all | --[no-]ignore-removal | [--update | -u]]\n' +
                                        '           [--intent-to-add | -A] [--refresh] [--ignore-errors] [--ignore-missing] [--renormalize]\n' +
                                        '           [--chmod=(+|-)x] [--pathspec-from-file=<file> [--pathspec-file-nul]]\n' +
                                        '           [--] [<pathspec>...]';
                            }
                        }
                        break;
                        
                    case 'commit':
                        if (!terminalState.repoInitialized) {
                            output = 'fatal: not a git repository (or any of the parent directories): .git';
                        } else if (parts.length < 4 || parts[2] !== '-m') {
                            output = 'error: switch `m\' expects a value\nusage: git commit [<options>] [--] <pathspec>...\n\n    -m, --message <message>    commit message';
                        } else if (terminalState.stagedFiles.length === 0) {
                            output = 'nothing added to commit but untracked files present (use "git add" to track)';
                        } else {
                            const message = parts.slice(3).join(' ').replace(/"/g, '');
                            const commitId = generateCommitId();
                            
                            terminalState.commits.unshift({
                                id: commitId,
                                message: message,
                                files: [...terminalState.stagedFiles],
                                date: new Date().toLocaleString(),
                                branch: terminalState.currentBranch
                            });
                            
                            terminalState.stagedFiles = [];
                            
                            output = `[${terminalState.currentBranch} ${commitId}] ${message}\n ${terminalState.commits[0].files.length} file(s) changed`;
                        }
                        break;
                        
                    case 'log':
                        if (!terminalState.repoInitialized) {
                            output = 'fatal: your current branch \'' + terminalState.currentBranch + '\' does not have any commits yet';
                        } else if (terminalState.commits.length === 0) {
                            output = 'fatal: your current branch \'' + terminalState.currentBranch + '\' does not have any commits yet';
                        } else {
                            const oneline = parts.includes('--oneline');
                            
                            terminalState.commits.forEach(commit => {
                                if (oneline) {
                                    output += `${commit.id.substring(0, 7)} ${commit.message}\n`;
                                } else {
                                    output += `commit ${commit.id}\n`;
                                    output += `Author: John Doe <john@example.com>\n`;
                                    output += `Date:   ${commit.date}\n\n`;
                                    output += `    ${commit.message}\n\n`;
                                }
                            });
                        }
                        break;
                        
                    case 'branch':
                        output = '* ' + terminalState.currentBranch;
                        break;
                        
                    default:
                        output = `git: '${gitCommand}' is not a git command. See 'git --help'.`;
                }
                break;
                
            case 'ls':
                output = terminalState.files.join('\n');
                break;
                
            case 'touch':
                if (args.length > 0) {
                    const filename = args[0];
                    if (!terminalState.files.includes(filename)) {
                        terminalState.files.push(filename);
                        output = `File '${filename}' created.`;
                    } else {
                        output = `File '${filename}' already exists.`;
                    }
                } else {
                    output = 'usage: touch <filename>';
                }
                break;
                
            case 'mkdir':
                if (args.length > 0) {
                    output = `Directory '${args[0]}' created.`;
                } else {
                    output = 'usage: mkdir <dirname>';
                }
                break;
                
            case 'pwd':
                output = terminalState.currentDir;
                break;
                
            default:
                output = `Command not found: ${baseCommand}. Type 'help' for available commands.`;
        }
        
        // Afficher la sortie
        if (output) {
            addOutputLine(output);
        }
    }
    
    // Événements du terminal
    terminalInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            executeCommand(this.value);
            this.value = '';
        }
    });
    
    executeButton.addEventListener('click', function() {
        executeCommand(terminalInput.value);
        terminalInput.value = '';
        terminalInput.focus();
    });
    
    clearButton.addEventListener('click', function() {
        terminalOutput.innerHTML = '';
        addOutputLine('Terminal cleared.');
    });
    
    resetButton.addEventListener('click', function() {
        terminalState = {
            currentDir: '~/projet-git',
            repoInitialized: false,
            files: ['README.md', 'index.html', 'style.css'],
            stagedFiles: [],
            commits: [],
            currentBranch: 'main'
        };
        
        terminalOutput.innerHTML = '';
        initTerminal();
        addOutputLine('Terminal state reset to initial configuration.');
    });
    
    quickCommands.forEach(button => {
        button.addEventListener('click', function() {
            const command = this.getAttribute('data-command');
            terminalInput.value = command;
            executeCommand(command);
            terminalInput.value = '';
        });
    });
    
    // Focus sur l'input du terminal
    terminalInput.focus();
    
    // Initialiser le terminal
    initTerminal();
});