import React, {useEffect, useState} from 'react';
import {withNavigationFocus} from 'react-navigation';
import {useSelector} from 'react-redux';

import {parseISO, formatRelative} from 'date-fns';
import pt from 'date-fns/locale/pt';

import PropTypes from 'prop-types';

import Background from '~/components/Background';
import Button from '~/components/Button';
import HelpOrder from '~/components/HelpOrder';
import api from '~/services/api';

import {Container, List, Loading} from './styles';

function HelpOrderList({navigation, isFocused}) {
  const student = useSelector(state => state.student.profile);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [helpOrders, setHelpOrders] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [page, setPage] = useState(1);

  async function loadHelpOrders(pg) {
    setLoading(true);

    if (hasNextPage) {
      const response = await api.get(`students/${student.id}/help-orders`, {
        params: {page: pg, pageLimit: 10},
      });

      if (response.data.length > 0) {
        const newArray = response.data;
        newArray.map(helpOrder => {
          helpOrder.dateFormatted = formatRelative(
            parseISO(helpOrder.created_at),
            new Date(),
            {locale: pt},
          );
          return helpOrder;
        });

        setHelpOrders(pg >= 2 ? [...helpOrders, ...newArray] : newArray);
      } else {
        setPage(pg - 1);
        setHasNextPage(false);
      }
    }

    setLoading(false);
  }

  useEffect(() => {
    loadHelpOrders(page);
  }, [student, isFocused]);// eslint-disable-line

  async function handleCreate() {
    navigation.navigate('HelpOrderCreate', {
      student_id: student.id,
    });
  }

  function handleItemClick(helpOrder) {
    navigation.navigate('HelpOrderAnswer', {
      helpOrder,
    });
  }

  async function loadMore() {
    const nextPage = page + 1;
    loadHelpOrders(nextPage);
    setPage(nextPage);
  }

  async function refreshList() {
    setRefreshing(true);
    setHasNextPage(true);
    setHelpOrders([]);
    setPage(1);
    await loadHelpOrders(1);
    setRefreshing(false);
  }

  return (
    <Background>
      <Container>
        <Button loading={loading} onPress={handleCreate}>
          Novo pedido de auxílio
        </Button>
        <List
          data={helpOrders}
          keyExtractor={item => String(item.id)}
          onRefresh={refreshList}
          refreshing={refreshing}
          ListFooterComponent={loading && <Loading />}
          onEndReachedThreshold={0.2}
          onEndReached={() => loadMore()}
          renderItem={({item}) => (
            <HelpOrder data={item} onPress={() => handleItemClick(item)} />
          )}
        />
      </Container>
    </Background>
  );
}

HelpOrderList.propTypes = {
  isFocused: PropTypes.bool,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

HelpOrderList.defaultProps = {
  isFocused: false,
};

export default withNavigationFocus(HelpOrderList);
