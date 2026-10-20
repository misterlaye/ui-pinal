/**
 * Message lisible d'une erreur d'appel API.
 *
 * L'API renvoie ses erreurs au format ProblemDetail : le message destiné à l'utilisateur est dans `detail`.
 * Quelques réponses historiques utilisent encore `message`. Sans réponse du serveur (réseau coupé,
 * délai dépassé), un message explicite est renvoyé plutôt qu'une erreur générique.
 */
export function apiErrorMessage(error, fallback = 'Une erreur est survenue. Veuillez réessayer.') {
  const data = error?.response?.data;
  if (data && typeof data === 'object') {
    if (typeof data.detail === 'string' && data.detail.trim()) return data.detail;
    if (typeof data.message === 'string' && data.message.trim()) return data.message;
  }
  if (error?.code === 'ECONNABORTED') {
    return 'Le serveur met trop de temps à répondre. Vérifiez votre connexion puis réessayez.';
  }
  if (error && !error.response) {
    return 'Serveur injoignable. Vérifiez votre connexion internet.';
  }
  return fallback;
}
