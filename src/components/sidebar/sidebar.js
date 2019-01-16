import React from "react";

const SideBar = props => {

    return (
        <nav className="w3-sidebar w3-white" id="mySidebar">
            <div className="w3-bar-block">
                <button className="w3-bar-item w3-button w3-padding player-box player1"><i className="fa fa-users fa-fw"></i>  Player 1</button>
                <button className="w3-bar-item w3-button w3-padding player-box player2"><i className="fa fa-eye fa-fw"></i>  Player 2</button>
                <button className="w3-bar-item w3-button w3-padding player-box player3"><i className="fa fa-users fa-fw"></i>  Player 3</button>
                <button className="w3-bar-item w3-button w3-padding player-box player4"><i className="fa fa-diamond fa-fw"></i>  Player 4</button>
            </div>
        </nav>
    );
};

export default SideBar;
