import timeit

setup_inline = """
def test_inline():
    try:
        raise Exception("error")
    except Exception as e:
        import time
"""

setup_module = """
import time
def test_module():
    try:
        raise Exception("error")
    except Exception as e:
        pass
"""

print("Inline import: ", timeit.timeit("test_inline()", setup=setup_inline, number=1000000))
print("Module import: ", timeit.timeit("test_module()", setup=setup_module, number=1000000))
