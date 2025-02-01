import styled from "styled-components";

export const Dropdown = styled.select`
    width: 100%;
		min-width: 80px;
    padding: 10px;
    text-align: center;
    border: none;
    border-radius: 5px;
    background-color: #fff;
    font-size: clamp(0.8rem, 1vw, 2.5rem);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        border-color: #3498db;
    }

    &:focus {
        border-color: #3498db;
        outline: none;
    }

    option[value=""] {
        font-weight: bold;
        font-size: clamp(0.8rem, 1vw, 2.5rem);
    }

    option {
        font-size: clamp(0.8rem, 1vw, 2.5rem);
    }
`;