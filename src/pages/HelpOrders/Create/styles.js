import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1 auto;
  background: #eee;
  padding: 10px 20px 20px 20px;
`;

export const Answer = styled.TextInput.attrs({
  multiline: true,
  placeholderTextColor: '#999999',
  textAlignVertical: 'top',
  numberOfLines: 10,
})`
  border-radius: 4px;
  border: 1px solid #ddd;
  background: #fff;
  font-size: 16px;
  padding: 20px;
  max-height: 230px;
`;

export const LengthInput = styled.Text`
  text-align: right;
  margin: 0 10px;
  font-size: 10px;
  color: ${props => (props.limit ? '#ee4e62' : '#666666')};
`;
