// Initialiser Firebase avec les clés de ton projet
const firebaseConfig = {
    apiKey: "AIzaSyDgpZ2J8W0A3mAVilK0bfI-W2_WZd8fI2k",
    authDomain: "chiffoumi-c23d3.firebaseapp.com",
    databaseURL: "https://drk-web.github.io/chiffoumi-game/",
    projectId: "chiffoumi-c23d3",
    storageBucket: "chiffoumi-c23d3.firebasestorage.app",
    messagingSenderId: "916373593336",
    appId: "1:916373593336:web:ad6dcb1e97c74dceb7ef0d"
};

// Initialiser Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Fonction pour envoyer le choix du joueur
function sendChoice(player, choice) {
    database.ref('game/' + player).set({
        choice: choice
    });

    // Masquer les boutons et afficher "en attente de l'autre joueur"
    document.getElementById('choices-container').style.display = 'none';
    document.getElementById('message').innerText = 'En attente de l\'autre joueur...';

    checkGameStatus(); // Vérifier le statut du jeu (si les 2 joueurs ont fait un choix)
}

// Fonction pour vérifier l'état du jeu (les deux joueurs ont-ils fait un choix ?)
function checkGameStatus() {
    database.ref('game').on('value', (snapshot) => {
        const data = snapshot.val();

        if (data.player1 && data.player2) {
            document.getElementById('message').innerText = 'Le jeu est en cours !';
            document.getElementById('user-choice').src = getChoiceImage(data.player1.choice);
            document.getElementById('computer-choice').src = getChoiceImage(data.player2.choice);

            determineWinner(data.player1.choice, data.player2.choice); // Déterminer le gagnant
        }
    });
}

// Fonction pour récupérer l'image du choix
function getChoiceImage(choice) {
    const images = {
        pierre: 'https://i.pinimg.com/736x/e5/90/37/e5903708c6a48f51da6517b497556fa3.jpg',
        papier: 'https://i.pinimg.com/736x/8e/24/b2/8e24b215121943b23aeea6073acec383.jpg',
        ciseaux: 'https://i.pinimg.com/736x/ca/84/64/ca8464512623a038e40b6327bab0331b.jpg'
    };
    return images[choice];
}

// Fonction pour déterminer le gagnant
function determineWinner(player1Choice, player2Choice) {
    let resultMessage = '';
    if (player1Choice === player2Choice) {
        resultMessage = 'C\'est une égalité!';
    } else if (
        (player1Choice === 'pierre' && player2Choice === 'ciseaux') ||
        (player1Choice === 'papier' && player2Choice === 'pierre') ||
        (player1Choice === 'ciseaux' && player2Choice === 'papier')
    ) {
        resultMessage = 'Le joueur 1 gagne!';
    } else {
        resultMessage = 'Le joueur 2 gagne!';
    }
    document.getElementById('message').innerText = resultMessage;
}

// Fonction pour réinitialiser le jeu
function resetGame() {
    document.getElementById('choices-container').style.display = 'flex';
    document.getElementById('result-container').style.visibility = 'hidden';
    document.getElementById('message').innerText = 'En attente d\'un joueur...';

    // Réinitialiser les données de Firebase
    database.ref('game').set({});
}
