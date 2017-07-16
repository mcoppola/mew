import React, { PropTypes } from "react";
import Link from "next/link";
import * as R from "ramda";
import debounce from 'lodash.debounce';

import { apiRequest, errorMessage, upvoteAlbum } from "../utils/api";
import { searchAlbums } from "../utils/lastfm";

export default class AlbumsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      err: "loading albums...",
      albums: [],
      refreshing: false,
      query: null,
      lastAlbumClicked: null
    };

    this.refreshAlbums = debounce(this.refreshAlbums.bind(this), 1000, { trailing: true });
    this.onItemClick = this.onItemClick.bind(this);
    this._onUserSelect = this._onUserSelect.bind(this);
    this.setQuery = this.setQuery.bind(this);
  }

  async componentDidMount() {
    this.api = apiRequest(this.props.userToken);
    this.refreshAlbums();

    // setInterval(this.refreshAlbums, 5*1000)
  }

  async refreshAlbums() {
    console.log('refreshAlbums()');
    // if (this.state.refreshing) return
    // this.setState({ refreshing: true })

    let oldPos = this.state.albums.map((a, i) => {
      return { id: a._id, pos: i };
    });
    // fetch albums
    let res = await this.api.get(this.state.query || "/albums?limit=30");

    // user filter or album upvote?
    let albums = this.calcDeltas(oldPos, this.sortByPoints(res.data));
    this.setState({ albums, err: null });

    // after UI transition, end refreshing
    setTimeout(() => {
      this.setState({ refreshing: false });
    }, 817);
  }

  setQuery(query) {
    this.setState({ query }, () => this.refreshAlbums());
  }

  sortByPoints(albums) {
    return R.reverse(R.sortBy(R.prop("pointsNow"), albums));
  }
  calcDeltas(oldPos, albums) {
    return albums.map((album, i) => {
      return R.merge(album, {
        delta: R.filter(a => a.id === album._id, oldPos).length
          ? R.filter(a => a.id === album._id, oldPos)[0].pos - i
          : oldPos.length ? albums.length - i : 0
      });
    });
  }

  async onItemClick(album) {
    console.log('onItemClick');
    // if (this.state.refreshing) return

    // set clicked state on album
    // take it off after transition
    if (album === this.state.lastAlbumClicked) {
      this.setState({ lastAlbumClicked: null }, () =>
        setTimeout(() => this.setState({ lastAlbumClicked: album }), 1)
      );
    } else {
      this.setState({ lastAlbumClicked: album });
    }
    clearTimeout(this.clickTimeout);
    this.clickTimeout = setTimeout(
      () => this.setState({ lastAlbumClicked: null }),
      817
    );

    let albums = this.state.albums.map(a => { 
      if (a._id === album) { a.pointsNow++ }
      return a
    })

    // +1 to album in list
    this.setState({ albums })

    // Send upvote request
    upvoteAlbum({ album, userToken: this.props.userToken })
      .then(this.refreshAlbums)
      .catch(err => this.setState({ err: errorMessage(err) }));

    this.props.onVoteAction({ type: "upvote", value: 1 });
  }

  _onUserSelect(user) {
    if (this.state.refreshing) return;

    this.setState({ query: "/albums/user/" + user.id + "?limit=30" }, () =>
      this.refreshAlbums()
    );
    this.props.onUserSelect(user);
  }

  formatTitle(t) {
    let max = 26;
    return t.length > max ? t.substring(0, max) + "... " : t;
  }

  itemClass(a) {
    let base = "mw-album-list__item cf ";
    let delta = "delta__" + a.delta;
    let clicked = a._id === this.state.lastAlbumClicked ? " item--clicked" : "";
    return base + delta + clicked;
  }

  render() {
    return (
      <div>
        {this.state.err &&
          <p className="red">
            {this.state.err}
          </p>}
        {this.state.albums.map((a, i) =>
          <div className={this.itemClass(a)} key={a._id + "__" + a.title}>
            <div className="fl f6 mw--mono mr2">
                  <div className="lh-solid color--purple w2 mb05">
                    {i + 1}
                  </div>
                  <div className="lh-solid color--green w2 mb05">
                    {a.pointsNow}
                  </div>
                  <div className="lh-solid color--gray3 w2">
                    {a.pointsTotal}
                  </div>
                </div>
            <img
              className="mw-album-list__item__img fl mr3"
              src={"" || a.image[1]}
              alt=""
              onClick={this.onItemClick.bind(null, a._id)}
            />
            <div className="fl">
              <div className="cf">
                <h6 className="dib v-btm lh-solid mw--sabon mw--small">
                  {this.formatTitle(a.title)}
                </h6>
                <p className="dib v-btm lh-solid mw--smaller color--dark mw--med">
                  &nbsp;<span className="color--purple">/</span>&nbsp;{this.formatTitle(a.artist)}
                </p>
              </div>
              <div className="db">
                <div className="fl pt1">
                  {a.pointsUsers.map(u =>
                    <div
                      className="fl tc mr1 dim pointer"
                      onClick={e => this._onUserSelect(u)}
                      key={u.id + "__pointsusers"}
                    >
                      <img
                        src={u.profileImage}
                        className="br-100 h1 w1 dib"
                        alt=""
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

            

// <div className="mw-album-list__item__up mt1 fl mr2 pointer color--gray3" onClick={this.onItemClick.bind(null, a._id)} >up</div>
