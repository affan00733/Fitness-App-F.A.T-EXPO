import React, {
  useCallback,
  useLayoutEffect,
  useEffect,
  useState,
  useRef,
} from 'react';
import {Linking, Platform, ToastAndroid} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {
  FirebaseRecaptchaVerifierModal,
  FirebaseRecaptchaBanner,
} from 'expo-firebase-recaptcha';
import {useData, useTheme, useTranslation} from '../hooks/';
import * as regex from '../constants/regex';
import {Block, Button, Input, Image, Text, Checkbox} from '../components/';
import Firebase from '../firebaseConfig.js';
import Constants from 'expo-constants';
import {getAuth, PhoneAuthProvider} from 'firebase/auth';

const isAndroid = Platform.OS === 'android';

interface IRegistration {
  // name: string;
  email: string;
  password: string;
  agreed: boolean;
}
interface IRegistrationValidation {
  // name: boolean;
  email: boolean;
  password: boolean;
  agreed: boolean;
}

const Register = () => {
  const auth = Firebase.auth();
  const firestore = Firebase.firestore();
  const [verificationId, setVerificationId] = useState(null);
  const [user, setUser] = useState(null);

  const recaptchaVerifier = useRef(null);
  const {isDark} = useData();
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [isValid, setIsValid] = useState<IRegistrationValidation>({
    // name: false,
    email: false,
    password: false,
    agreed: false,
  });
  const [registration, setRegistration] = useState<IRegistration>({
    // name: '',
    email: '',
    password: '',
    agreed: false,
  });
  const {assets, colors, gradients, sizes} = useTheme();
  const handleChange = useCallback(
    (value) => {
      setRegistration((state) => ({...state, ...value}));
    },
    [setRegistration],
  );

    useLayoutEffect(() => {
      navigation.setOptions({
        swipeEnabled: false,
      });
    }, [ navigation]);


  useEffect(() => {
    navigation.setOptions({
      swipeEnabled: false,
    });
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = auth.onAuthStateChanged(
      async (authenticatedUser) => {
        try {
          await (authenticatedUser
            ? setUser(authenticatedUser)
            : setUser(null));
          // console.log("authenticatedUser",authenticatedUser);
          if (authenticatedUser) {
            console.log(
              'user logged in',
              authenticatedUser.providerData[0].phoneNumber,
            );
            ToastAndroid.show(
              `Welcome User ${authenticatedUser.providerData[0].phoneNumber}`,
              ToastAndroid.LONG,
            );
            navigation.navigate('Screens');
          } else {
            console.log('user not there');
          }
        } catch (error) {
          console.log(error);
        }
      },
    );

    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
    console.log('unsubscribeAuth', user);
  }, [navigation]);

  const logout = useCallback(async () => {
    console.log('====================================');
    console.log('user logged in ', user);
    console.log('====================================');

    await auth.signOut();
  }, [isValid, registration]);

  const handlePhone = useCallback(async () => {
if (
  regex.phone.test(registration.email) === true ||
  registration.agreed === true
) {
  await firestore
    .collection('auth')
    .doc(registration.email)
    .get()
    .then((data) => {
      if (data.id === registration.email && data.data().type === 'employee') {
        auth
          .signInWithPhoneNumber(registration.email, recaptchaVerifier.current)
          .then((x) => {
            console.log('verificationId', x);
            setVerificationId(x);
            ToastAndroid.show(
              `Employee ${registration.email} OTP Sent`,
              ToastAndroid.LONG,
            );
          })
          .catch((err) => {
            console.log(err);
          });

        console.log(data.data());
      } else {
        ToastAndroid.show('Not an Employee', ToastAndroid.LONG);
      }
    })
    .catch((err) => {
      console.log(err);
      ToastAndroid.show('Invalid Phone Number', ToastAndroid.LONG);
    });
  console.log(registration);
}
  }, [isValid, registration]);

  const handleCode = useCallback(async () => {
    if (
      regex.phone.test(registration.password) === true ||
      registration.agreed === true
    ) {
      verificationId
        .confirm(registration.password)
        .then((result) => {
          // User signed in successfully.
          const user = result.user;
          console.log('user code', user);
          navigation.navigate('Screens');
          ToastAndroid.show(
            `Welcome User ${registration.email}`,
            ToastAndroid.LONG,
          );
          // ...
        })
        .catch((error) => {
          console.log('====================================');
          console.log('error', error);
          console.log('====================================');
          // User couldn't sign in (bad verification code?)
          // ...
        });
      console.log('code', verificationId);
    }
  }, [isValid, registration]);

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      email: regex.phone.test(registration.email),
      password: regex.otp.test(registration.password),
      // password: registration.password,
      agreed: registration.agreed,
    }));
  }, [registration, setIsValid]);

  return (
    <Block safe marginTop={sizes.md}>
      <Block paddingHorizontal={sizes.s}>
        <Block flex={0} style={{zIndex: 0}}>
          <Image
            background
            resizeMode="cover"
            padding={sizes.sm}
            radius={sizes.cardRadius}
            source={assets.background}
            height={sizes.height * 0.3}>
            {/* <Button
              row
              flex={0}
              justify="flex-start"
              onPress={() => navigation.goBack()}>
              <Image
                radius={0}
                width={10}
                height={18}
                color={colors.white}
                source={assets.arrow}
                transform={[{rotate: '180deg'}]}
              />
              <Text p white marginLeft={sizes.s}>
                {t('common.goBack')}
              </Text>
            </Button> */}

            <Text h4 center white marginBottom={sizes.md}>
              Login
            </Text>
          </Image>
        </Block>
        {/* register form */}
        <Block
          keyboard
          behavior={!isAndroid ? 'padding' : 'height'}
          marginTop={-(sizes.height * 0.2 - sizes.l)}>
          <Block
            flex={0}
            radius={sizes.sm}
            marginHorizontal="8%"
            shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
          >
            <Block
              blur
              flex={0}
              intensity={90}
              radius={sizes.sm}
              overflow="hidden"
              justify="space-evenly"
              tint={colors.blurTint}
              paddingVertical={sizes.sm}>
              <Text p semibold center>
                {t('register.subtitle')}
              </Text>
              {/* social buttons */}
              <Block row center justify="space-evenly" marginVertical={sizes.m}>
                <Button outlined gray shadow={!isAndroid}>
                  <Image
                    source={assets.facebook}
                    height={sizes.m}
                    width={sizes.m}
                    color={isDark ? colors.icon : undefined}
                  />
                </Button>
                <Button outlined gray shadow={!isAndroid}>
                  <Image
                    source={assets.apple}
                    height={sizes.m}
                    width={sizes.m}
                    color={isDark ? colors.icon : undefined}
                  />
                </Button>
                <Button outlined gray shadow={!isAndroid}>
                  <Image
                    source={assets.google}
                    height={sizes.m}
                    width={sizes.m}
                    color={isDark ? colors.icon : undefined}
                  />
                </Button>
              </Block>
              <Block
                row
                flex={0}
                align="center"
                justify="center"
                marginBottom={sizes.sm}
                paddingHorizontal={sizes.xxl}>
                <Block
                  flex={0}
                  height={1}
                  width="50%"
                  end={[1, 0]}
                  start={[0, 1]}
                  gradient={gradients.divider}
                />
                <Text center marginHorizontal={sizes.s}>
                  {t('common.or')}
                </Text>
                <Block
                  flex={0}
                  height={1}
                  width="50%"
                  end={[0, 1]}
                  start={[1, 0]}
                  gradient={gradients.divider}
                />
              </Block>
              {/* form inputs */}
              <Block paddingHorizontal={sizes.sm}>
                <FirebaseRecaptchaVerifierModal
                  ref={recaptchaVerifier}
                  firebaseConfig={Constants.manifest.extra.firebase}
                  title="Prove you are human!"
                  cancelLabel="Close"
                />
                {/* <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={t('common.name')}
                  placeholder={t('common.namePlaceholder')}
                  success={Boolean(registration.name && isValid.name)}
                  danger={Boolean(registration.name && !isValid.name)}
                  onChangeText={(value) => handleChange({name: value})}
                /> */}
                <Input
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  label={'Phone Number'}
                  keyboardType="phone-pad"
                  placeholder={'Enter your Phone Number'}
                  success={Boolean(registration.email && isValid.email)}
                  danger={Boolean(registration.email && !isValid.email)}
                  onChangeText={(value) => handleChange({email: value})}
                />
                <Input
                  secureTextEntry
                  autoCapitalize="none"
                  marginBottom={sizes.m}
                  keyboardType="number-pad"
                  label={'OTP'}
                  placeholder={'Enter your OTP'}
                  onChangeText={(value) => handleChange({password: value})}
                  success={Boolean(registration.password && isValid.password)}
                  danger={Boolean(registration.password && !isValid.password)}
                />
              </Block>
              {/* checkbox terms */}
              <Block row flex={0} align="center" paddingHorizontal={sizes.sm}>
                <Checkbox
                  marginRight={sizes.sm}
                  checked={registration?.agreed}
                  onPress={(value) => handleChange({agreed: value})}
                />
                <Text paddingRight={sizes.s}>
                  {t('common.agree')}
                  <Text
                    semibold
                    onPress={() => {
                      Linking.openURL('https://www.creative-tim.com/terms');
                    }}>
                    {t('common.terms')}
                  </Text>
                </Text>
              </Block>
              <Button
                onPress={handlePhone}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                gradient={gradients.primary}
                // disabled={Object.values(isValid).includes(false)}
                disabled={
                  regex.phone.test(registration.email) === false ||
                  registration.agreed === false
                }>
                <Text bold white transform="uppercase">
                  Get Code
                </Text>
              </Button>
              <Button
                primary
                outlined
                shadow={!isAndroid}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                onPress={handleCode}
                disabled={
                  regex.phone.test(registration.password) === false ||
                  registration.agreed === false
                }>
                <Text bold primary transform="uppercase">
                  Send Code
                </Text>
              </Button>
              {/* <Button
                primary
                outlined
                shadow={!isAndroid}
                marginVertical={sizes.s}
                marginHorizontal={sizes.sm}
                onPress={logout}>
                <Text bold primary transform="uppercase">
                  logout
                </Text>
              </Button> */}
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default Register;
