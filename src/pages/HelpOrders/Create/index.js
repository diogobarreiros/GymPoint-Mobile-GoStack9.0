import React, {useState, useMemo} from 'react';
import {TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import PropTypes from 'prop-types';

import Background from '~/components/Background';
import Button from '~/components/Button';
import api from '~/services/api';

import {Container, Answer, LengthInput} from './styles';

export default function NewHelpOrder({navigation}) {
  const student_id = navigation.getParam('student_id');
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');

  const questionLength = useMemo(() => {
    return 255 - question.length;
  }, [question.length]);

  async function handleSend() {
    try {
      setLoading(true);
      await api.post(`/students/${student_id}/help-orders`, {question});

      Alert.alert('Seu pedido de auxílio foi enviado com sucesso');

      navigation.navigate('HelpOrderList');
    } catch (error) {
      Alert.alert(
        'Falha na tentativa',
        'Ocorreu algum erro, verifique o seu pedido e tente novamente',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Background>
      <Container>
        <Answer
          placeholder="Inclua seu pedido de auxílio"
          onChangeText={setQuestion}
        />
        <LengthInput limit={questionLength < 0}>
          {questionLength}/255
        </LengthInput>

        <Button loading={loading} onPress={handleSend}>
          Enviar pedido
        </Button>
      </Container>
    </Background>
  );
}

NewHelpOrder.navigationOptions = ({navigation}) => ({
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
      }}>
      <Icon name="chevron-left" size={25} color="#ee4d64" />
    </TouchableOpacity>
  ),
});

NewHelpOrder.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};
