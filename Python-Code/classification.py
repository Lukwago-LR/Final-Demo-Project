import os
import numpy as np
import tensorflow as tf
import tensorflow_hub


class Classifying:
    def __init__(self):
        # Find the unique label values
        self.unique_labels = ['Bengin', 'Malignant', 'Normal']

        # Define the batch size, 32 is a good start
        self.BATCH_SIZE = 32

        # Define image size
        self.IMG_SIZE = 224

    # Turn prediction probabilities into their respective labels
    def get_prediction_label(self, prediction_probabilities):
        return self.unique_labels[np.argmax(prediction_probabilities)]

    # Create a function to load a trained model

    def load_model(self, model_path):
        model = tf.keras.models.load_model(model_path,
                                           custom_objects={
                                               "KerasLayer": tensorflow_hub.KerasLayer}
                                           )
        return model

    # Create a function for preprocessing images

    def process_image(self, image_path):
        image = tf.io.read_file(image_path)

        # Turn the jpg image into numerical tensor with 3 colour channels (Red, Green,Blue)
        image = tf.image.decode_jpeg(image, channels=3)

        # convert the colour channel values from 0-255 to 0-1 values
        image = tf.image.convert_image_dtype(image, tf.float32)

        # Resize the image to our desired value (244,244)
        image = tf.image.resize(image, size=[self.IMG_SIZE, self.IMG_SIZE])

        return image

    def get_image_label(self, image_path, label):
        image = self.process_image(image_path)
        return image, label

    # Create a function to turn data into batches

    def create_data_batches(self, X, y=None, batch_size=32, valid_data=False, test_data=False):
        if test_data:
            data = tf.data.Dataset.from_tensor_slices(
                (tf.constant(X)))  # only filepaths (no labels)
            data_batch = data.map(self.process_image).batch(batch_size)
            return data_batch
        elif valid_data:
            data = tf.data.Dataset.from_tensor_slices((tf.constant(X),  # filepaths
                                                       tf.constant(y)))  # labels
            data_batch = data.map(self.get_image_label).batch(self.BATCH_SIZE)
            return data_batch
        else:
            data = tf.data.Dataset.from_tensor_slices((tf.constant(X),  # filepaths
                                                       tf.constant(y)))  # labels
            # Shuffling path_names and labels before mapping image processor function is faster than shuffling images
            data = data.shuffle(buffer_size=len(X))

            # Create (image,label) tuples (This also turns the image paths into a preprocessed image)
            data = data.map(self.get_image_label)

            # Turn the training data into batches
            data_batch = data.batch(self.BATCH_SIZE)
            return data_batch

    def classify_image(self, image_path_list):
        # Turn the custom image into batch datasets
        custom_data = self.create_data_batches(image_path_list, test_data=True)

        # Loading the full model
        loaded_full_model = self.load_model("public/trainedModel/20231006-17521696614772-New.hdf5")

        # Make predictions on the custom data
        custom_predictions = loaded_full_model.predict(custom_data)

        # Get custom image prediction labels
        custom_prediction_labels = [self.get_prediction_label(
            custom_predictions[i]) for i in range(len(custom_predictions))]

        # return the predicted label_list
        return custom_prediction_labels

    def predict(self):
        # let now access the image for our machine learning processing
        root_image_path = "public/uploads/"
        image_filenames = [root_image_path +
                           file_name for file_name in os.listdir(root_image_path)]

        # Classification of the image
        predicted_label_list = self.classify_image(image_filenames)
        return predicted_label_list
