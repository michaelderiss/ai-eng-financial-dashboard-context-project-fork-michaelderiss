# Product Overview

## Repository purpose
This repository delivers a financial dashboard system with a React + TypeScript frontend and a FastAPI backend. The project is currently oriented toward maintainability and workflow governance rather than feature expansion.

## What the product currently does
- Presents a dashboard with KPI cards for income, outcome, profit, and profit margin.
- Displays monthly trend visualizations for income vs outcome and profit percentage.
- Exposes backend analytics endpoints for filtered metrics, facets, summaries, top categories, period comparison, and alert candidates.

## Functional boundaries
- Backend data is generated mock data (deterministic seed usage in endpoints), not persisted in a database.
- Frontend currently consumes the core metrics list endpoint and computes displayed KPI/chart values client-side.

## Intended value for contributors
- Provides a realistic full-stack codebase where contributors can practice repository stewardship:
  - Validate understanding with evidence from code.
  - Apply enforceable engineering rules.
  - Maintain operational memory artifacts for future handovers.
