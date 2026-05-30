from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.resources import Resource

from opentelemetry.exporter.otlp.proto.http.trace_exporter import (
    OTLPSpanExporter,
)

from opentelemetry.sdk.trace.export import (
    BatchSpanProcessor,
)

resource = Resource.create({
    "service.name": "llm-observability-platform"
})

provider = TracerProvider(resource=resource)

trace.set_tracer_provider(provider)

otlp_exporter = OTLPSpanExporter(
    endpoint="http://localhost:4318/v1/traces"
)

provider.add_span_processor(
    BatchSpanProcessor(otlp_exporter)
)

tracer = trace.get_tracer(__name__)