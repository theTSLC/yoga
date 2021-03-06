/**
 * Copyright (c) 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 * @format
 */

import React, {Component} from 'react';
import {Tooltip, notification, Button, Input} from 'antd';
import './URLShortener.css';

const API_KEY = 'AIzaSyCRvdtNY07SGUokChS8oA9EaYJafFL0zMI';

type State = {
  shortURL: ?string,
  loading: boolean,
};

export default class URLShortener extends Component<{}, State> {
  _ref: ?HTMLElement = null;

  state = {
    loading: false,
    shortURL: null,
  };

  componentDidMount() {
    window.addEventListener('hashchange', this.onHashChange);
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.onHashChange);
  }

  onHashChange = () => {
    this.setState({shortURL: null});
  };

  onClick = () => {
    this.setState(
      {
        loading: true,
      },
      () => {
        fetch(`https://www.googleapis.com/urlshortener/v1/url?key=${API_KEY}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            kind: 'urlshortener#url',
            longUrl: window.location.href,
          }),
        })
          .then(res => res.json())
          .then(({id}) => this.setState({shortURL: id, loading: false}))
          .catch(() => this.setState({shortURL: null, loading: false}));
      },
    );
  };

  render() {
    return this.state.shortURL ? (
      <Input
        value={this.state.shortURL}
        autoFocus
        ref={ref => {
          if (ref) {
            ref.input.select();
          }
        }}
      />
    ) : (
      <Button
        className="URLShortener"
        onClick={this.onClick}
        icon="share-alt"
        disabled={this.state.loading}
        type="primary">
        Share URL
      </Button>
    );
  }
}
