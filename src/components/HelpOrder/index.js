import React from 'react';
import {TouchableOpacity} from 'react-native';

import {
  Container,
  Header,
  Status,
  Time,
  StatusIcon,
  StatusText,
  Question,
} from './styles';

export default function HelpOrder({data, onPress}) {
  return (
    <Container>
      <TouchableOpacity onPress={onPress}>
        <Header>
          <Status answer={data.answer}>
            <StatusIcon answer={data.answer} />
            <StatusText answer={data.answer}>
              {data.answer ? 'Respondido' : 'Sem resposta'}
            </StatusText>
          </Status>

          <Time>{data.dateFormatted}</Time>
        </Header>
        <Question>{data.question}</Question>
      </TouchableOpacity>
    </Container>
  );
}
