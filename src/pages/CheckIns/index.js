import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import {withNavigationFocus} from 'react-navigation';
import {useSelector} from 'react-redux';

import {parseISO, formatRelative} from 'date-fns';
import pt from 'date-fns/locale/pt';

import PropTypes from 'prop-types';

import Background from '~/components/Background';
import Button from '~/components/Button';
import CheckIn from '~/components/CheckIn';
import api from '~/services/api';

import {Container, List, Loading} from './styles';

function CheckIns({isFocused}) {
  const student = useSelector(state => state.student.profile);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [checkins, setCheckins] = useState([]);
  const [newCheckins, setNewCheckins] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [page, setPage] = useState(1);

  async function loadCheckIns(pg) {
    const pageLimit = 10;
    setLoading(true);

    if (checkins === []) {
      const array = newCheckins.concat(checkins);
      setCheckins(array);
    } else if (hasNextPage || pg === 1) {
      const response = await api.get(`students/${student.id}/checkins`, {
        params: {page: pg, pageLimit},
      });

      setHasNextPage(response.data.hasNextPage);

      let countChekins =
        pg >= 2
          ? response.data.totalDocs - (pg - 1) * pageLimit
          : response.data.totalDocs;

      if (countChekins > 0) {
        const newArray = response.data.docs;
        newArray.map(checkin => {
          checkin.dateFormatted = formatRelative(
            parseISO(checkin.createdAt),
            new Date(),
            {locale: pt},
          );
          checkin.index = countChekins;
          countChekins -= 1;
          return checkin;
        });

        setCheckins(pg >= 2 ? [...checkins, ...newArray] : newArray);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    loadCheckIns(page);
  }, [student, newCheckins, isFocused]);// eslint-disable-line

  async function handleCheckin() {
    setLoading(true);
    try {
      const response = await api.post(`students/${student.id}/checkins`);
      setNewCheckins(response.data);
      return Alert.alert('Sucesso', 'Check-in incluído com sucesso');
    } catch (err) {
      return Alert.alert(
        'Falha na tentativa',
        'O aluno só pode fazer 5 check-ins dentro de 7 dias corridos',
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    if (hasNextPage) {
      const nextPage = page + 1;
      loadCheckIns(nextPage);
      setPage(nextPage);
    }
  }

  async function refreshList() {
    setRefreshing(true);
    setHasNextPage(true);
    setPage(1);
    await loadCheckIns(1);
    setRefreshing(false);
  }

  return (
    <Background>
      <Container>
        <Button loading={loading} onPress={handleCheckin}>
          Novo check-in
        </Button>
        <List
          data={checkins}
          keyExtractor={item => String(item._id)}
          onRefresh={refreshList}
          refreshing={refreshing}
          ListFooterComponent={loading && <Loading />}
          onEndReachedThreshold={0.2}
          onEndReached={() => loadMore()}
          renderItem={({item}) => <CheckIn data={item} />}
        />
      </Container>
    </Background>
  );
}

CheckIns.propTypes = {
  isFocused: PropTypes.bool,
};

CheckIns.defaultProps = {
  isFocused: false,
};

export default withNavigationFocus(CheckIns);
