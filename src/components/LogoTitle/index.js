import React from 'react';

import logo from '~/assets/logoheader.png';

import {Container, Logo} from './styles';

export default function LogoTitle() {
  return (
    <Container>
      <Logo source={logo} />
    </Container>
  );
}
