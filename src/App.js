import React, { Component } from "react";
import CardList from "./components/cardlist";
import Controls from "./components/controls";
import GameMessage from "./components/gamemessage";
import shuffle from "./components/shuffle";
import cards from "./cards.json";
import "./App.css";
import TitleBar from "./components/titlebar";
import SideBar from "./components/sidebar";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: [],
      dealerTotal: 0,
      dealerTotalAlt: 0,
      dealerCards: [],
      playerTotal: 0,
      playerTotalAlt: 0,
      playerCards: [],
      bet: 0,
      chips: 100,
      isPlaying: false,
      gameMsg: null
    };
  }

  checkDeck = deck => {
    return this.state.deck.length < 10 ? deck.concat(shuffle(cards)) : deck;
  };

  calcCards = () => {
    this.setState({
      dealerTotal: this.calcCardTotal(this.state.dealerCards, false),
      dealerTotalAlt: this.calcCardTotal(this.state.dealerCards, true),
      playerTotal: this.calcCardTotal(this.state.playerCards, false),
      playerTotalAlt: this.calcCardTotal(this.state.playerCards, true)
    });
  };

  calcCardTotal = (cards, eleven) => {
    let sum = Object.keys(cards).reduce(function (total, card) {
      let cardVal = Number(cards[card].cardValue);
      cardVal = cardVal === 1 && eleven ? 11 : cardVal;
      return Number(total) + cardVal;
    }, 0);
    return sum;
  };

  drawCards = (deck, playerCards, numberOfCards) => {
    var i;
    for (i = 1; i <= numberOfCards; i++) {
      let card = deck.pop();
      playerCards.push(card);
    }
    return playerCards;
  };

  //check if player bust
  checkForBust = () => {
    let t1,
      t2,
      min,
      status = "";
    t1 = this.calcCardTotal(this.state.playerCards, false);
    t2 = this.calcCardTotal(this.state.playerCards, true);
    min = Math.min(t1, t2);
    if (min > 21) {
      status = "Over 21 - You Lose!!!!";
    }

    this.setState({
      gameMsg: status
    });
  };

  makeBet = betVal => {
    this.setState(prevState => ({
      bet: prevState.bet + betVal,
      chips: prevState.chips - betVal
    }));
  };

  clearBet = () => {
    this.setState(prevState => ({
      bet: 0,
      chips: prevState.chips + prevState.bet
    }));
  };

  // Deal Cards
  dealClicked = () => {
    let deck = this.checkDeck(this.state.deck);
    let dealerCards = this.state.dealerCards;
    let playerCards = this.state.playerCards;

    if (this.state.bet === 0) return;

    this.drawCards(deck, dealerCards, 2);
    this.drawCards(deck, playerCards, 2);

    this.setState(
      prevState => ({
        deck: deck,
        dealerCards: dealerCards,
        playerCards: playerCards,
        isPlaying: true
      }),
      this.calcCards()
    );
  };

  hitClicked = () => {
    let deck = this.checkDeck(this.state.deck);
    let playerCards = this.state.playerCards;
    this.drawCards(deck, playerCards, 1);

    this.setState(
      prevState => ({
        playerCards: playerCards,
        deck: deck
      }),
      this.calcCards(),
      this.checkForBust()
    );
  };

  checkDealerStatus = (dealerCards, playerTotal) => {
    let t1,
      t2,
      status = "";

    t1 = this.calcCardTotal(dealerCards, false);
    t2 = this.calcCardTotal(dealerCards, true);

    if (Math.min(t1, t2) > 21) {
      status = "Player Wins!!!";
    } else if (
      (t1 <= 21 && t1 === playerTotal) ||
      (t2 <= 21 && t2 === playerTotal)
    ) {
      status = "Push";
    } else if (
      (t1 <= 21 && t1 > playerTotal) ||
      (t2 <= 21 && t2 > playerTotal)
    ) {
      status = "Dealer wins!!!";
    }

    return status;
  };

  stayClicked = () => {
    //Draw dealer cards until value equals or is higher then user.
    let playerTotal = Math.max(
      this.state.playerTotal,
      this.state.playerTotalAlt
    );
    if (playerTotal > 21)
      playerTotal = Math.min(this.state.playerTotal, this.state.playerTotalAlt);
    let deck = this.checkDeck(this.state.deck);
    let dealerCards = this.state.dealerCards;
    let status = this.checkDealerStatus(dealerCards, playerTotal);

    if (status === "") {
      do {
        this.drawCards(deck, dealerCards, 1);
        status = this.checkDealerStatus(dealerCards, playerTotal);
      } while (status === "");
    }

    this.setState(
      prevState => ({
        deck: deck,
        dealerCards: dealerCards,
        gameMsg: status
      }),
      this.calcCards()
    );
  };

  resetGame = () => {
    let chips = this.state.chips;
    let bet = this.state.bet;
    debugger;
    //Calculate chips
    if (this.state.gameMsg === "Push - Tie with the Dealer.") {
      chips = chips + bet;
    } else if (this.state.gameMsg === "You Win!!!") {
      chips = chips + bet * 2;
    }

    this.setState({
      deck: [],
      dealerTotal: 0,
      dealerTotalAlt: 0,
      dealerCards: [],
      playerTotal: 0,
      playerTotalAlt: 0,
      playerCards: [],
      isPlaying: false,
      bet: 0,
      chips: chips,
      gameMsg: null
    });
  };

  render() {
    return (
      <div className="wrapper">
        <TitleBar />
        <SideBar />
        <div className="game-area">
          <CardList
            cardDisplay="Dealer:"
            cardTotal={this.state.dealerTotal}
            cardTotalAlt={this.state.dealerTotalAlt}
            cards={this.state.dealerCards}
          />
          <CardList
            cardDisplay="Player:"
            cardTotal={this.state.playerTotal}
            cardTotalAlt={this.state.playerTotalAlt}
            cards={this.state.playerCards}
          />
          <Controls
            bet={this.state.bet}
            chips={this.state.chips}
            isPlaying={this.state.isPlaying}
            makeBet={this.makeBet}
            dealClicked={this.dealClicked}
            hitClicked={this.hitClicked}
            stayClicked={this.stayClicked}
            clearBet={this.clearBet}
          />
          {this.state.gameMsg ? (
            <GameMessage msg={this.state.gameMsg} resetClicked={this.resetGame} />
          ) : (
              false
            )}
        </div>
      </div>
    );
  }
}

export default App;
