import { ImageBase64Utils } from '../../../src/utils/image-base-64-utils';

describe('ImageBase64Utils', () => {
  describe('getBase64ImageExtension', () => {
    test('should return png', () => {
      const input =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAb0lEQVR4nGJxOyTJAAN3WibA2ffOHoCzW74IwdlMDCQC2mtgvCrHC+fYXhCGs7eazYSzN0/SoKOTSPfD/HXhcM6tjfvgbP08LTjb+OceOjqJdD9IGbPCOezpy+Bswws2cPaN77/p6CSSNQACAAD//4jtGEB2ph6JAAAAAElFTkSuQmCC';
      const result = ImageBase64Utils.getBase64ImageExtension(input);
      expect(result).toBe('png');
    });

    test('should return jpeg', () => {
      const input =
        'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAb0lEQVR4nGJxOyTJAAN3WibA2ffOHoCzW74IwdlMDCQC2mtgvCrHC+fYXhCGs7eazYSzN0/SoKOTSPfD/HXhcM6tjfvgbP08LTjb+OceOjqJdD9IGbPCOezpy+Bswws2cPaN77/p6CSSNQACAAD//4jtGEB2ph6JAAAAAElFTkSuQmCC';
      const result = ImageBase64Utils.getBase64ImageExtension(input);
      expect(result).toBe('jpeg');
    });

    test('should return png even if in the image it is .png', () => {
      const input =
        'data:image/.png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAb0lEQVR4nGJxOyTJAAN3WibA2ffOHoCzW74IwdlMDCQC2mtgvCrHC+fYXhCGs7eazYSzN0/SoKOTSPfD/HXhcM6tjfvgbP08LTjb+OceOjqJdD9IGbPCOezpy+Bswws2cPaN77/p6CSSNQACAAD//4jtGEB2ph6JAAAAAElFTkSuQmCC';
      const result = ImageBase64Utils.getBase64ImageExtension(input);
      expect(result).toBe('png');
    });
  });

  describe('isValidBase64Image', () => {
    describe('should return false', () => {
      test('if input is a number', async () => {
        const input = 123;
        const result = await ImageBase64Utils.isValidBase64Image(input);
        expect(result).toBe(false);
      });

      test('if input is null', async () => {
        const input = null;
        const result = await ImageBase64Utils.isValidBase64Image(input);
        expect(result).toBe(false);
      });

      test('if input is undefined', async () => {
        const input = undefined;
        const result = await ImageBase64Utils.isValidBase64Image(input);
        expect(result).toBe(false);
      });

      test('if input is an empty string', async () => {
        const input = '';
        const result = await ImageBase64Utils.isValidBase64Image(input);
        expect(result).toBe(false);
      });

      test('if input is invalid base64 image', async () => {
        const input =
          'data:imagiVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAjElEQVR4nGI5GbeLARsoeXcZq3hZmR5W8bTEC1jFmbCKUhGMWjBqAeWAUbBEAKtE1F9hrOJrDwthFdcp7ccqPvSDaNSCEWABy4nXCdht3nYIq/h1n19Yxe2mfcJuDlnOIgGMWjBqAeWA0fUzP1YJtSc9WMVf8eRiFc8QmYFVfOgH0agFI8ACQAAAAP//RvQYf4MnINYAAAAASUVORK5CY';
        const result = await ImageBase64Utils.isValidBase64Image(input);
        expect(result).toBe(false);
      });
    });
    describe('should return true', () => {
      test('if input is a base64 string without a header', async () => {
        const input =
          'iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=';
        const result = await ImageBase64Utils.isValidBase64Image(input);
        expect(result).toBe(true);
      });

      test('if input is a base64 with header', async () => {
        const input =
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=';
        const result = await ImageBase64Utils.isValidBase64Image(input);
        expect(result).toBe(true);
      });

      test('if input is encoded gif', async () => {
        const input =
          'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAjElEQVR4nGI5GbeLARsoeXcZq3hZmR5W8bTEC1jFmbCKUhGMWjBqAeWAUbBEAKtE1F9hrOJrDwthFdcp7ccqPvSDaNSCEWABy4nXCdht3nYIq/h1n19Yxe2mfcJuDlnOIgGMWjBqAeWA0fUzP1YJtSc9WMVf8eRiFc8QmYFVfOgH0agFI8ACQAAAAP//RvQYf4MnINYAAAAASUVORK5CYII=';
        const result = await ImageBase64Utils.isValidBase64Image(input);
        expect(result).toBe(true);
      });

      test('if input is encoded webp', async () => {
        const input =
          'data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAiUlEQVR4nGJ5vFGAARsoWaaJVfw9qzFWcVEpfaziTFhFqQhGLRi1gHLA+FdoAVYJnVXYNRxR3Y5V/M2Gr1jFh34QjVowAixgubW+C6vEzzOPsIov5nyPVfx/3y2s4kM/iEYtGAEWMD4zFMYqcX03B1bxxQIlWMWtzV9gFR/6QTRqwQiwABAAAP//nl4ZZnQbEd0AAAAASUVORK5CYII=';
        const result = await ImageBase64Utils.isValidBase64Image(input);
        expect(result).toBe(true);
      });
    });
  });
});
