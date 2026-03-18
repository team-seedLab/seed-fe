import { keyframes } from "@emotion/react";

// 왼쪽 잎 떨어지는 애니메이션
export const leafFallLeftAnimation = `${keyframes`
  0%   { transform: translate(0px,   0px)  rotate(12deg);  opacity: 0; }
  6%   { transform: translate(4px,   5px)  rotate(0deg);   opacity: 1; }
  12%  { transform: translate(0px,  11px)  rotate(-14deg); opacity: 1; }
  20%  { transform: translate(-6px, 19px)  rotate(0deg);   opacity: 1; }
  28%  { transform: translate(0px,  26px)  rotate(14deg);  opacity: 1; }
  36%  { transform: translate(5px,  34px)  rotate(0deg);   opacity: 1; }
  44%  { transform: translate(0px,  42px)  rotate(-13deg); opacity: 1; }
  52%  { transform: translate(-5px, 49px)  rotate(0deg);   opacity: 1; }
  60%  { transform: translate(0px,  56px)  rotate(12deg);  opacity: 1; }
  68%  { transform: translate(4px,  62px)  rotate(0deg);   opacity: 1; }
  76%  { transform: translate(0px,  67px)  rotate(-10deg); opacity: 1; }
  84%  { transform: translate(-4px, 73px)  rotate(0deg);   opacity: 1; }
  92%  { transform: translate(0px,  76px)  rotate(8deg);   opacity: 1; }
  100% { transform: translate(2px,  80px)  rotate(0deg);   opacity: 1; }
`} 2800ms linear forwards`;

// 오른쪽 잎 떨어지는 애니메이션
export const leafFallRightAnimation = `${keyframes`
  0%   { transform: translate(0px,   0px)  rotate(-12deg); opacity: 0; }
  12%  { transform: translate(-4px,  5px)  rotate(0deg);   opacity: 1; }
  28%  { transform: translate(0px,  13px)  rotate(12deg);  opacity: 1; }
  46%  { transform: translate(5px,  22px)  rotate(0deg);   opacity: 1; }
  64%  { transform: translate(0px,  30px)  rotate(-10deg); opacity: 1; }
  80%  { transform: translate(-3px, 36px)  rotate(0deg);   opacity: 1; }
  92%  { transform: translate(0px,  39px)  rotate(7deg);   opacity: 1; }
  100% { transform: translate(-2px, 41px)  rotate(0deg);   opacity: 1; }
`} 1435ms linear forwards`;
