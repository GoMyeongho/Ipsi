import styled from "styled-components";

const StyledInput = styled.input`
  margin: 0 30px;
  width: 100%;
  height: auto;
  line-height: normal;
  padding: 1em;
  border: 1px solid #999;
  border-radius: 18px;
  outline-style: none;
`;

const InputComponent = ({ value, onChange, placeholder }) => {
  return (
    <StyledInput
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default InputComponent;
