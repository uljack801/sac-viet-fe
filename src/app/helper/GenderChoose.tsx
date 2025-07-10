export const genderChoose = (value: string | undefined) => {
  if (value === "male") {
    return <p>Nam</p>
  } else if (value === "Female") {
    return <p>Nữ</p>
  } else {
    return <p>Khác</p>
  }
};
