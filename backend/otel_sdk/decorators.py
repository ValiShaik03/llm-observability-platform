from functools import wraps

from otel_sdk.tracer import tracer


def trace_function(
    span_name
):

    def decorator(func):

        @wraps(func)
        def wrapper(
            *args,
            **kwargs
        ):

            with tracer.start_as_current_span(
                span_name
            ):

                return func(
                    *args,
                    **kwargs
                )

        return wrapper

    return decorator