# Development Guide

## Auto-increment ID Management

- The system uses a `Counter` collection to keep track of auto-increment IDs.
- Use `getNextId(modelName)` in document creation.
- Use `flushIds(modelName)` **only if the collection for `modelName` is empty**.
- Safeguard for `flushIds(modelName) is in place by ensuring collection is empty before flushing.
