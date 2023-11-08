import warnings

from classification import Classifying

def function_that_warns():
    warnings.warn("deprecated", DeprecationWarning)

with warnings.catch_warnings():
    warnings.simplefilter("ignore")
    print(Classifying().predict())
    function_that_warns()  # this will not show a warning



