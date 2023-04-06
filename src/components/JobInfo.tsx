import React from "react";
import { IconType } from "react-icons";
import styled from "styled-components";

interface JobInfo {
  icon: JSX.Element;
  text: string;
}

export default function JobInfo({ icon, text }: JobInfo) {
  return (
    <Wrapper>
      <span className="icon">{icon}</span>
      <span className="text">{text}</span>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin-top: 0.5rem;
  display: flex;
  align-items: center;

  .icon {
    font-size: 1rem;
    margin-right: 1rem;
    display: flex;
    align-items: center;
    svg {
      color: var(--grey-400);
    }
  }
  .text {
    text-transform: capitalize;
    letter-spacing: var(--letterSpacing);
  }
`;
