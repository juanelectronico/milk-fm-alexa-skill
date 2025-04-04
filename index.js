const Alexa = require('ask-sdk-core');

// URL de la emisora Milk FM
const RADIO_STREAM_URL = 'https://stream.zeno.fm/07zek6w01a0uv';

// Manejador para iniciar la reproducción de la radio
const PlayRadioHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest' ||
               (handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
                handlerInput.requestEnvelope.request.intent.name === 'PlayRadioIntent');
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .addAudioPlayerPlayDirective('REPLACE_ALL', RADIO_STREAM_URL, 'Milk FM', 0)
            .withShouldEndSession(true)
            .getResponse();
    }
};

// Manejador para pausar la reproducción
const PauseRadioHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
               handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PauseIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .addAudioPlayerStopDirective()
            .getResponse();
    }
};

// Manejador para reanudar la reproducción
const ResumeRadioHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
               handlerInput.requestEnvelope.request.intent.name === 'AMAZON.ResumeIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .addAudioPlayerPlayDirective('REPLACE_ALL', RADIO_STREAM_URL, 'Milk FM', 0)
            .getResponse();
    }
};

// Manejador para detener la reproducción
const StopRadioHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
               handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .addAudioPlayerStopDirective()
            .getResponse();
    }
};

// Manejador para la ayuda
const HelpHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
               handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'Puedes decir: "Reproduce Milk FM" para escuchar la radio. ¿En qué más puedo ayudarte?';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// Manejador para cancelar o salir
const CancelAndStopHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
               (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Adiós. ¡Gracias por escuchar Milk FM!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .withShouldEndSession(true)
            .getResponse();
    }
};

// Manejador para errores
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);
        return handlerInput.responseBuilder
            .speak('Lo siento, no pude reproducir Milk FM en este momento. Por favor, inténtalo de nuevo más tarde.')
            .getResponse();
    }
};

// Configuración del SDK
const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        PlayRadioHandler,
        PauseRadioHandler,
        ResumeRadioHandler,
        StopRadioHandler,
        HelpHandler,
        CancelAndStopHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();