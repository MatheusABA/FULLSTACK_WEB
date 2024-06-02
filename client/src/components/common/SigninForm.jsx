import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import userApi from "../../api/modules/userApi";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import { setUser } from "../../redux/features/userSlice";

const SigninForm = ({ switchAuthState }) => {
  const dispatch = useDispatch();

  const [isLoginRequest, setIsLoginRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState(); // Use null em vez de undefined

  const signinForm = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email inválido")
        .required("O email é obrigatório"),
      password: Yup.string()
        .min(8, "A senha deve ter no mínimo 8 caracteres")
        .required("A senha é obrigatória")
    }),
    onSubmit: async values => {
      setErrorMessage(undefined);
      setIsLoginRequest(true);
      console.log("Requesting to server");
      const { response, err } = await userApi.signin(values);
      setIsLoginRequest(false);

      if (response) {
        console.log("Login feito com sucesso!", response);
        signinForm.resetForm();
        dispatch(setUser(response));
        dispatch(setAuthModalOpen(false));
        toast.success("Login bem-sucedido");
      }

      if (err) {
        console.error("Login failed:", err);
        setErrorMessage(err.message);
      }
    }
  });

  return (
    <Box component="form" onSubmit={signinForm.handleSubmit}>
      <Stack spacing={3}>
        <TextField
          type="email" // Certifique-se de que o tipo está correto
          placeholder="Email"
          name="email"
          fullWidth
          value={signinForm.values.email}
          onChange={signinForm.handleChange}
          color="success"
          error={signinForm.touched.email && signinForm.errors.email !== undefined}
          helperText={signinForm.touched.email && signinForm.errors.email}
        />
        <TextField
          type="password"
          placeholder="Senha"
          name="password"
          fullWidth
          value={signinForm.values.password}
          onChange={signinForm.handleChange}
          color="success"
          error={signinForm.touched.password && signinForm.errors.password !== undefined}
          helperText={signinForm.touched.password && signinForm.errors.password}
        />
      </Stack>

      <LoadingButton
        type="submit"
        fullWidth
        size="large"
        variant="contained"
        sx={{ marginTop: 4 }}
        loading={isLoginRequest}
      >
        Acessar
      </LoadingButton>

      <Button
        fullWidth
        sx={{ marginTop: 1 }}
        onClick={() => switchAuthState()}
      >
        Cadastrar-se
      </Button>

      {errorMessage && (
        <Box sx={{ marginTop: 2 }}>
          <Alert severity="error" variant="outlined">{errorMessage}</Alert>
        </Box>
      )}
    </Box>
  );
};

export default SigninForm;
