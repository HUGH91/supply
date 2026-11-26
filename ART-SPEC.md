# H91 Supply · Look Spec (v2: four-angle renders)

Every look in the store is a 3D-style render of Hugh in one fixed pose, shot from four angles in the same frame.
Because every render shares the frame, new merch lines up pixel for pixel.

| Rule | Spec |
| --- | --- |
| Canvas | 420 × 880 px PNG per view |
| Views | Front, Right side, Back, Left side (Right side = Hugh facing the viewer's left) |
| Background | Plain white (cut out for the store) |
| Frame | Head top at y = 15, soles at y = 865, figure centered |
| Pose | Same as the cream base tee: facing front, arms relaxed at the sides |
| Fixed parts | Bandana, sunglasses, curls, cuffed denim and moc toe boots stay identical unless the piece replaces them |
| 3D | One GLB per look, same pose, feet at height 0, facing front |

## Making a new look

Start from the cream base tee renders (`art/base/`) and change only the merch piece.
Keep camera, lighting, scale and pose exactly the same.

## Files

A folder per look named for the product (e.g. `Hood-Star-Tee/`) with `Front.png`, `Right-side.png`,
`Back.png`, `Left-side.png` and `<Look>.glb`. In the store they become
`art/looks/<look>_<front|right|back|left>.webp` and `models/looks/<look>.glb`.

## Checklist

- [ ] All four views are 420 × 880 on white
- [ ] Head top at y = 15 and soles at y = 865 in every view
- [ ] Pose, scale and lighting match the cream base tee
- [ ] Graphics, colors and logo placement match the real product
- [ ] GLB included, facing front
