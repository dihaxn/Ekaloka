import { useMemo } from 'react';

// Translation data
const translations = {
  en: {
    // Login page
    login: {
      title: 'Welcome Back',
      subtitle: 'Sign in to your account',
      email: {
        label: 'Email Address',
        placeholder: 'Enter your email',
      },
      password: {
        label: 'Password',
        placeholder: 'Enter your password',
        show: 'Show password',
        hide: 'Hide password',
      },
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      signIn: 'Sign In',
      signingIn: 'Signing in...',
      waitTime: 'Please wait {seconds}s...',
      orContinueWith: 'Or continue with',
      noAccount: "Don't have an account?",
      signUp: 'Sign up',
      success: {
        toast: 'Login successful!',
        announcement: 'Login successful! Redirecting...',
      },
    },
    // MFA page
    mfa: {
      title: 'Two-Factor Authentication',
      subtitle: 'Please complete the additional verification step',
      otp: {
        label: 'Authentication Code',
        placeholder: 'Enter 6-digit code',
      },
      verify: 'Verify',
      verifying: 'Verifying...',
      webauthn: {
        button: 'Use Security Key',
      },
      back: 'Back to login',
    },
    // Validation messages
    validation: {
      email: {
        required: 'Email is required',
        invalid: 'Please enter a valid email address',
      },
      password: {
        required: 'Password is required',
      },
      otp: {
        required: 'Authentication code is required',
      },
    },
    // Error messages
    errors: {
      configuration: 'Configuration error. Please contact support.',
      invalidResponse: 'Invalid response from server',
      rateLimit: {
        withTime:
          'Too many login attempts. Please wait {seconds} seconds before trying again.',
        generic: 'Too many login attempts. Please wait before trying again.',
      },
      invalidCredentials:
        'Invalid login credentials. Please check your email and password.',
      generic: 'An error occurred. Please try again.',
      mfa: {
        invalid: 'Invalid authentication code. Please try again.',
        failed: 'MFA verification failed. Please try again.',
        webauthn: 'Security key authentication failed. Please try again.',
      },
    },
    // Footer
    footer: {
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      help: 'Help',
    },
  },
  es: {
    // Login page
    login: {
      title: 'Bienvenido de Vuelta',
      subtitle: 'Inicia sesión en tu cuenta',
      email: {
        label: 'Dirección de Email',
        placeholder: 'Ingresa tu email',
      },
      password: {
        label: 'Contraseña',
        placeholder: 'Ingresa tu contraseña',
        show: 'Mostrar contraseña',
        hide: 'Ocultar contraseña',
      },
      rememberMe: 'Recordarme',
      forgotPassword: '¿Olvidaste tu contraseña?',
      signIn: 'Iniciar Sesión',
      signingIn: 'Iniciando sesión...',
      waitTime: 'Por favor espera {seconds}s...',
      orContinueWith: 'O continúa con',
      noAccount: '¿No tienes una cuenta?',
      signUp: 'Regístrate',
      success: {
        toast: '¡Inicio de sesión exitoso!',
        announcement: '¡Inicio de sesión exitoso! Redirigiendo...',
      },
    },
    // MFA page
    mfa: {
      title: 'Autenticación de Dos Factores',
      subtitle: 'Por favor completa el paso de verificación adicional',
      otp: {
        label: 'Código de Autenticación',
        placeholder: 'Ingresa el código de 6 dígitos',
      },
      verify: 'Verificar',
      verifying: 'Verificando...',
      webauthn: {
        button: 'Usar Clave de Seguridad',
      },
      back: 'Volver al login',
    },
    // Validation messages
    validation: {
      email: {
        required: 'El email es requerido',
        invalid: 'Por favor ingresa un email válido',
      },
      password: {
        required: 'La contraseña es requerida',
      },
      otp: {
        required: 'El código de autenticación es requerido',
      },
    },
    // Error messages
    errors: {
      configuration: 'Error de configuración. Por favor contacta soporte.',
      invalidResponse: 'Respuesta inválida del servidor',
      rateLimit: {
        withTime:
          'Demasiados intentos de login. Por favor espera {seconds} segundos antes de intentar de nuevo.',
        generic:
          'Demasiados intentos de login. Por favor espera antes de intentar de nuevo.',
      },
      invalidCredentials:
        'Credenciales de login inválidas. Por favor verifica tu email y contraseña.',
      generic: 'Ocurrió un error. Por favor intenta de nuevo.',
      mfa: {
        invalid:
          'Código de autenticación inválido. Por favor intenta de nuevo.',
        failed: 'Verificación MFA falló. Por favor intenta de nuevo.',
        webauthn:
          'Autenticación con clave de seguridad falló. Por favor intenta de nuevo.',
      },
    },
    // Footer
    footer: {
      privacy: 'Política de Privacidad',
      terms: 'Términos de Servicio',
      help: 'Ayuda',
    },
  },
  fr: {
    // Login page
    login: {
      title: 'Bon Retour',
      subtitle: 'Connectez-vous à votre compte',
      email: {
        label: 'Adresse Email',
        placeholder: 'Entrez votre email',
      },
      password: {
        label: 'Mot de passe',
        placeholder: 'Entrez votre mot de passe',
        show: 'Afficher le mot de passe',
        hide: 'Masquer le mot de passe',
      },
      rememberMe: 'Se souvenir de moi',
      forgotPassword: 'Mot de passe oublié ?',
      signIn: 'Se Connecter',
      signingIn: 'Connexion en cours...',
      waitTime: 'Veuillez attendre {seconds}s...',
      orContinueWith: 'Ou continuer avec',
      noAccount: "Vous n'avez pas de compte ?",
      signUp: "S'inscrire",
      success: {
        toast: 'Connexion réussie !',
        announcement: 'Connexion réussie ! Redirection...',
      },
    },
    // MFA page
    mfa: {
      title: 'Authentification à Deux Facteurs',
      subtitle: "Veuillez compléter l'étape de vérification supplémentaire",
      otp: {
        label: "Code d'Authentification",
        placeholder: 'Entrez le code à 6 chiffres',
      },
      verify: 'Vérifier',
      verifying: 'Vérification...',
      webauthn: {
        button: 'Utiliser la Clé de Sécurité',
      },
      back: 'Retour à la connexion',
    },
    // Validation messages
    validation: {
      email: {
        required: "L'email est requis",
        invalid: 'Veuillez entrer un email valide',
      },
      password: {
        required: 'Le mot de passe est requis',
      },
      otp: {
        required: "Le code d'authentification est requis",
      },
    },
    // Error messages
    errors: {
      configuration: 'Erreur de configuration. Veuillez contacter le support.',
      invalidResponse: 'Réponse invalide du serveur',
      rateLimit: {
        withTime:
          'Trop de tentatives de connexion. Veuillez attendre {seconds} secondes avant de réessayer.',
        generic:
          'Trop de tentatives de connexion. Veuillez attendre avant de réessayer.',
      },
      invalidCredentials:
        'Identifiants de connexion invalides. Veuillez vérifier votre email et mot de passe.',
      generic: "Une erreur s'est produite. Veuillez réessayer.",
      mfa: {
        invalid: "Code d'authentification invalide. Veuillez réessayer.",
        failed: 'La vérification MFA a échoué. Veuillez réessayer.',
        webauthn:
          "L'authentification par clé de sécurité a échoué. Veuillez réessayer.",
      },
    },
    // Footer
    footer: {
      privacy: 'Politique de Confidentialité',
      terms: "Conditions d'Utilisation",
      help: 'Aide',
    },
  },
};

export const useTranslation = (locale = 'en') => {
  const t = useMemo(() => {
    const currentTranslations = translations[locale] || translations.en;

    return (key, params = {}) => {
      const keys = key.split('.');
      let value = currentTranslations;

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          // Fallback to English if translation not found
          let fallbackValue = translations.en;
          for (const fk of keys) {
            if (
              fallbackValue &&
              typeof fallbackValue === 'object' &&
              fk in fallbackValue
            ) {
              fallbackValue = fallbackValue[fk];
            } else {
              return key; // Return key if no translation found
            }
          }
          value = fallbackValue;
          break;
        }
      }

      if (typeof value === 'string') {
        // Replace parameters in the string
        return value.replace(/\{(\w+)\}/g, (match, param) => {
          return params[param] !== undefined ? params[param] : match;
        });
      }

      return key;
    };
  }, [locale]);

  return { t, locale };
};
