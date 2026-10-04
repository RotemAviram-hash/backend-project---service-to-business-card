import authService from "../services/authService.js";

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }
  const token = await authService.login(email, password);

  res.status(200).json({
    token,
  });
};
const googleLogin = async (req, res) => {
  const { idToken } = req.body;

  const token = await authService.googleLogin(idToken);

  res.status(200).json({
    token,
  });
};
export default {
  login,
  googleLogin,
};
