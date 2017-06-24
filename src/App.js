import React, { Component } from 'react';
import CitiesCount from './CitiesCount';
import Search from './Search';
import './static/css/index.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: [],
      chosenTiles: [],
      chosenTags: [],
      data: [],
    };
    this.tiles = [
      {
        name: 'Skateboarding',
        tagQuery: 'skateboard%7Cskatepark',
        nameC: 'skateboarding',

        name: 'Good food',
        tagQuery: 'food',
        nameC: 'food',
      },
      {
        name: 'Bars / pubs',
        tagQuery: 'bar',
        nameC: 'bar',
      },
      {
        name: 'Diving',
        tagQuery: 'diving',
        nameC: 'diving',
      },
      {
        name: 'Surfing',
        tagQuery: 'surfing',
        nameC: 'surfing',
      },
      {
        name: 'Beach',
        tagQuery: 'beach',
        nameC: 'beach',
      },
      {
        name: 'Spa / massages',
        tagQuery: 'spa|massages',
        nameC: 'massages',
      },
      {
        name: 'Hiking',
        tagQuery: 'hiking',
        nameC: 'hiking',
      },
      {
        name: 'Horse riding',
        tagQuery: 'Horse%20Riding',
        nameC: 'horse-riding',
      },
      {
        name: 'Sailing',
        tagQuery: 'sailing',
        nameC: 'sailing',
      },
      {
        name: 'Kayaking',
        tagQuery: 'kayaking',
        nameC: 'kayaking',
      },
      {
        name: 'Dolphin swimming',
        tagQuery: 'dolphin',
        nameC: 'dolphin',
      },
    ];
  }
  getData = () => {
    const query = this.state.chosenTags.join('%7C');
    fetch(
      `https://yojri0bch0.execute-api.eu-central-1.amazonaws.com/latest/places?tags=${query}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'x-api-key': 'nSCQiwW9R88zlr0P7J2VocUXBnKejmO26m9eIUl8',
        },
      },
    )
      .then(response => {
        return response.json();
      })
      .then(result => {
        console.log('response:', result);
        this.setState({ data: result });
      });
  };
  addTag = tag => {
    this.setState({ chosenTags: [...this.state.chosenTags, tag] }, () => {
      this.getData();
    });
  };
  removeTag = tag => {
    this.setState(
      {
        chosenTags: this.state.chosenTags.filter(item => item !== tag),
      },
      () => {
        console.log('chosen tags: ', this.state.chosenTags);
        if (this.state.chosenTags.length === 0) {
          this.setState({ data: [] });
        } else {
          this.getData();
        }
      },
    );
  };
  toggleTile = tile => {
    if (!this.state.chosenTiles.some(item => item.name === tile.name)) {
      this.setState({ chosenTiles: [...this.state.chosenTiles, tile] });
      this.addTag(tile.tagQuery);
    } else {
      this.removeTile(tile);
    }
  };
  removeTile = tile => {
    this.setState({
      chosenTiles: this.state.chosenTiles.filter(
        item => item.name !== tile.name,
      ),
    });
    this.removeTag(tile.tagQuery);
  };
  handleSearch = e => {
    e.preventDefault();
    this.setState({ query: e.target.value });
  };

  render() {
    const re = RegExp(this.state.query, 'i');

    const noCitiesToShow =
      !this.state.chosenTags.length ||
      !this.state.data ||
      !this.state.data.total;
    const tilesToShow = this.state.query
      ? this.tiles.filter(tile => tile.name.match(re))
      : this.tiles;
    return (
      <div className="App">
        <div className="container">
          <div className="column--left">
            <div className="logo" />

            <div className="title">Where do you wanna go?</div>
            <div className="location">
              <div className="place">
                <i className="fa fa-globe" aria-hidden="true" /> Literally
                anywhere.
              </div>
              <div className="button--link">choose some</div>
            </div>

            <div className="title">What will you enjoy on your trip?</div>

            {this.state.chosenTiles.map(tile =>
              <div
                className={`interest ${tile.nameC}`}
                key={tile.tagQuery + tile.name}
              >
                <div className="name">
                  <div className="interest-icon" />
                  {tile.name}
                </div>
                <div className="icon" onClick={() => this.removeTile(tile)}>
                  <i className="fa fa-times" aria-hidden="true" />
                </div>
              </div>,
            )}

            {this.state.chosenTiles.length == 0
              ? <div className="empty-state">
                  Select some activities.{' '}
                  <i className="fa fa-arrow-right" aria-hidden="true" />{' '}
                  <i className="fa fa-arrow-right" aria-hidden="true" />{' '}
                  <i className="fa fa-arrow-right" aria-hidden="true" />
                  <br /><br />Or you can stay home and enjoy photos from your
                  last trip. :-)
                </div>
              : null}

            <div className="button--huge">
              <div className="count">
                <CitiesCount
                  count={
                    noCitiesToShow ? '1,634,573' : `${this.state.data.total}`
                  }
                />
              </div>
              <div className="">
                places that match your needs
              </div>
            </div>
          </div>

          <div className="column--right">
            <Search applySearch={this.handleSearch} />
            <div className="list">
              {tilesToShow.map(tile => {
                const isSelected = this.state.chosenTiles.some(
                  item => item.name === tile.name,
                )
                  ? 'selected'
                  : '';
                return (
                  <div
                    className={`tile ${tile.nameC} ${isSelected}`}
                    key={tile.name + tile.tagQuery}
                    onClick={() => {
                      this.toggleTile(tile);
                    }}
                  >
                    <div className="gradient-layer" />
                    <div className="icon" />
                    <div className="name">{tile.name}</div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
