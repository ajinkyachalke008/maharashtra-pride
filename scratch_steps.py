import os

readme_path = 'c:/Users/HP/Desktop/new 1/maharashtra-pride-1/README.md'
with open(readme_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace arrows with animated SVG path
arrow1 = '<br><strong style="color: #00FFB3;">↓</strong><br>'
arrow2 = '<br><strong style="color: #FF5252;">↓</strong><br>'
new_arrow = '<br><img src="public/animated_arrow.svg" alt="Animated Connection" width="40"/><br>'

content = content.replace(arrow1, new_arrow).replace(arrow2, new_arrow)

# Replace step descriptions
step1_old = "With `python` (v3.11+) installed:"
step1_new = '<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=16&duration=2000&pause=500&color=00FFB3&center=true&vCenter=true&width=600&lines=With+Python+(v3.11%2B)+installed+%5BTypewriter+Effect%5D"/>'

step2_old = "With `npm` installed:"
step2_new = '<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=16&duration=2000&pause=500&color=00FFB3&center=true&vCenter=true&width=600&lines=With+NPM+installed+%5BTypewriter+Effect%5D"/>'

content = content.replace(step1_old, step1_new).replace(step2_old, step2_new)

with open(readme_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
