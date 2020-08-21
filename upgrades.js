var H5PUpgrades = H5PUpgrades || {};

H5PUpgrades['H5P.Dialogcards'] = (function () {
  return {
    1: {
      /**
       * Asynchronous content upgrade hook.
       * Upgrades content parameters to support DQ 1.4.
       *
       * Converts text and answer into rich text.
       * Escapes 'dangerous' symbols.
       *
       * @param {Object} parameters
       * @param {function} finished
       */
      4: function (parameters, finished) {
        // The old default was to scale the text and not the card
        parameters.behaviour = {
          scaleTextNotCard: true
        };

        // Complete
        finished(null, parameters);
      },

      7: function (parameters, finished, extras) {
        var extrasOut = extras || {};
        // Copy html-free title to new metadata structure if present
        var title = parameters.title || ((extras && extras.metadata) ? extras.metadata.title : undefined);
        if (title) {
          title = title.replace(/<[^>]*>?/g, '');
        }
        extrasOut.metadata = {
          title: title
        };

        finished(null, parameters, extrasOut);
      },

      /**
       * Asynchronous content upgrade hook.
       * Upgrades content parameters to use new structure. Moves existing values
       * to separate property objects for front and back.
       *
       * @param {Object} parameters
       * @param {function} finished
       */
      9: function (parameters, finished, extras) {
        parameters.dialogs = parameters.dialogs || [];
        parameters.dialogs = parameters.dialogs.map(function (dialog) {
          const newDialog = {};

          // Get copies of objects
          const image = dialog.image ? JSON.parse(JSON.stringify(dialog.image)) : undefined;
          const audio = dialog.audio ? JSON.parse(JSON.stringify(dialog.audio)) : undefined;

          dialog.tips = dialog.tips || {};

          // Move parameters
          newDialog.front = {
            text: dialog.text,
            image: image,
            imageAltText: dialog.imageAltText,
            audio: audio,
            tip: dialog.tips.front
          };

          // Keep previous logic: back has same image as front and no audio
          newDialog.back = {
            text: dialog.answer,
            image: image,
            imageAltText: dialog.imageAltText,
            tip: dialog.tips.back
          };

          return newDialog;
        });

        finished(null, parameters, extras);
      }
    }
  };
})();
