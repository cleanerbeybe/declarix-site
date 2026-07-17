# Formula contract

All arithmetic is deterministic, client-side, and uses only the five visible inputs.

## Inputs

| Input | Symbol | Valid range | Starting example |
|---|---:|---:|---:|
| Declarations per week | `D` | 1–100,000 | 120 |
| Current minutes per declaration | `M` | 0.5–480 | 45 |
| Loaded clerk cost per hour in GBP | `C` | 1–500 | 30 |
| Buyer-chosen target review minutes | `T` | 0.5–480 | 20 |
| Working weeks per year | `W` | 1–52 | 48 |

Starting values make the interface and outputs immediately legible. They are neither a benchmark
nor a prediction. The page tells the visitor to replace all five.

## Outputs

| Output | Formula |
|---|---|
| Annual entries | `D × W` |
| Current annual labour hours | `D × W × M ÷ 60` |
| Current annual labour cost | `current hours × C` |
| Target annual review hours | `D × W × T ÷ 60` |
| Target annual review cost | `target hours × C` |
| Recoverable hours | `MAX(0, current hours − target hours)` |
| Labour headroom | `MAX(0, current cost − target cost)` |
| Current labour cost per entry | `M × C ÷ 60` |
| Target labour cost per entry | `T × C ÷ 60` |
| Labour-only break-even per entry | `MAX(0, current cost/entry − target cost/entry)` |
| Theoretical additional entry capacity | `recoverable hours ÷ (T ÷ 60)` |
| Theoretical weekly capacity equivalent | `additional capacity ÷ W` |

If `T >= M`, recoverable hours, labour headroom, break-even, and additional capacity are zero. The
calculator does not turn a negative scenario into a saving.

## Commercial meaning

The break-even figure is the maximum per-processed-entry spend supported by modelled labour savings
alone. It is not a Declarix quote and not total ROI. The model excludes software price, setup,
integration, training, exception handling, quality changes, demand, service-level value, and revenue.

The capacity equivalent assumes every recovered hour can be reused for declarations at the target
review time. It is theoretical until representative workflow measurement supports the target.
