from contextlib import contextmanager
from otel_sdk.tracer import tracer

@contextmanager
def start_chat_span(username, model):
    with tracer.start_as_current_span(
        "chat_request"
    ) as span:

        span.set_attribute(
            "username",
            username
        )

        span.set_attribute(
            "model",
            model
        )

        yield span


@contextmanager
def start_inference_span(model):
    with tracer.start_as_current_span(
        "model_inference"
    ) as span:

        span.set_attribute(
            "provider",
            model
        )

        yield span


@contextmanager
def start_database_span():
    with tracer.start_as_current_span(
        "database_save"
    ) as span:
        yield span