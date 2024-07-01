// src/colorUtils.ts
export const interpolateColor = (value: number): string => {
  const red = [173, 216, 230]; // Light blue
  const white = [255, 255, 255]; // White
  const blue = [255, 182, 193]; // Light pink

  if (value <= 0) return `rgb(${blue.join(",")})`;
  if (value >= 7) return `rgb(${red.join(",")})`;

  const mixColor = (color1: number[], color2: number[], weight: number) => {
    return color1.map((c, i) =>
      Math.round(c * (1 - weight) + color2[i] * weight),
    );
  };

  let color;
  if (value < 5) {
    color = mixColor(blue, white, value / 5);
  } else {
    color = mixColor(white, red, (value - 5) / 2);
  }

  return `rgb(${color.join(",")})`;
};
