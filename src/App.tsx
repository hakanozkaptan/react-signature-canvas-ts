import './App.css';

import SignaturePad from "react-signature-canvas";
import {Button, FormControl, FormErrorMessage, FormLabel, Input,} from "@chakra-ui/react";
import {useRef} from "react";
import * as yup from "yup";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";

const formSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  imageUrl: yup
      .string()
      .required()
      .matches(
          /^data:image\/(?:gif|png|jpeg|bmp|webp|svg\+xml)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/,
          "Signature must be png"
      ),
});

type FormValues = {
    email: string;
    imageUrl: string;
    password: string;
};


function App() {
  let sigCanvas = useRef<HTMLCanvasElement>();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors } = {},
  } = useForm<FormValues>({
    mode: "onBlur",
    resolver: yupResolver(formSchema),
  });

  const onSubmit = (values: FormValues) => {
    console.log({ ...values });
  };

  const formatIntoPng = () => {
    if (sigCanvas?.current) {
        return sigCanvas?.current?.toDataURL();
    }
  };

  return (
      <form style={{ width: 350, margin: "auto" }}>
        <FormControl
            isInvalid={!!errors?.email?.message}
            p="4"
            isRequired
        >
          <FormLabel>Email</FormLabel>
          <Input
              type="email"
              placeholder="Email"
              {...register("email")}
          />
          <FormErrorMessage>
              {errors?.email?.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl
            isInvalid={!!errors?.password?.message}
            px="4"
            pb="4"
            isRequired
        >
          <FormLabel>Password</FormLabel>
          <Input
              {...register("password")}
              type="password"
              placeholder="Password"
          />
          <FormErrorMessage>
              {errors?.password?.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl
            isInvalid={!!errors?.imageUrl?.message}
            isRequired
            p="4"
        >
          <FormLabel>Signature</FormLabel>

          <Controller
              name="imageUrl"
              control={control}
              render={({ field }) => (
                  <SignaturePad
                      ref={sigCanvas as any}
                      onEnd={() => field.onChange(formatIntoPng())}
                      penColor="green"
                      canvasProps={{
                        width: 315,
                        height: 200,
                        style: { border: "1px solid green" },
                      }}
                  />
              )}
          />
          <FormErrorMessage>
            {errors?.imageUrl?.message}
          </FormErrorMessage>
        </FormControl>
        <Button
            onClick={handleSubmit(onSubmit)}
            p="4"
            mx="4"
            mt="6"
            w="90%"
            colorScheme="blue"
            variant="solid"
            disabled={!!errors?.email || !!errors?.password || !!errors?.imageUrl}
        >
          Login
        </Button>
      </form>
  );
}

export default App;
