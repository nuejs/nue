# Nueyaml: YAML without the problems
Nueyaml is YAML stripped down to its essence so you can write complex configurations without the usual YAML pitfalls.


## The problem with standard YAML
The original YAML specification buried a beautiful idea under 80 pages of features that cause more problems than they solve. It guesses what you mean, often guessing wrong:

```yaml
# YAML surprises
country: NO      # may become false (Norway problem)
time: 12:30      # may become 750 (minutes)
version: 1.10    # may become 1.1 (float)
port: 08080      # may become 4176 (octal)
```

These "conveniences" turn configuration files into minefields. You quote some values defensively, but not others. You remember some gotchas, but not all. Your configuration works until it doesn't.


## How Nueyaml fixes it
Nueyaml has one rule: be predictable. If it looks like a string to a human, it's a string:

```yaml
# Nueyaml: No surprises
country: NO       # string "NO"
time: 12:30       # string "12:30"
version: 1.10     # number 1.10
port: 08080       # string "08080"
```

Only obvious numbers (`123`, `45.67`) become numbers. Only `true` and `false` become booleans. Everything else stays a string.

Learn the details from [Nue website](https://nuejs.org/docs/nueyaml)