---
gas_schema: gas.doc.v1
type: report
title: "Engine parts and stack overlap: retained lab receipts and current Map questions"
status: complete
created: 2026-09-11T01:01:26Z
project: msf-wg-tool
project_code: msf-wg-tool
project_root: /Users/grig/work/spatial-computing-research-projects-msf/repo/msf-wg-tool
workstream: infrastructure-wg-map
created_by: map-delivery-worker
requested_by: owner
agent_task_id: cdd60b5d_1788736606
privacy_scope: project-readable
---

# Engine parts and stack overlap

Prepared 2026-09-11. The early engine-plane order's stop-early test is met: Open Spatial Lab retains a real combination attempt and its failure checks. This table extracts that evidence and relates it to the current Map. No old toggle interface is rebuilt.

**Evidence grades:** “Retained test” means a saved, bounded test result was inspected; it was not rerun today. “Documented” means a primary-source trace or implementation report, not a runtime test. “Unproven” means the inspected evidence does not establish the connection; it does not mean the capability is absent everywhere. Recorded Map levels are a separate data layer and must keep their confidence and source notes.

## What actually met in the lab

| Stack or standard | Retained combination evidence | Boundary that matters |
|---|---|---|
| Web of Worlds + Three.js + local world servers | **Retained test:** the [crossing receipt](/Users/grig/work/spatial-computing-research-projects-msf/repo/open-spatial-lab/evidence/wo019-crossing-proof.json) passes 81 checks. It constructs Three.js scenes from two WoW graphs, resolves the local `Portal.destination` extension, carries a newly minted continuity ID across the wire and observes it in destination state. | This is deterministic Node/backend proof, explicitly **no Chrome**. It does not prove pixels, generic WoW conformance or arbitrary third-party interoperability. The receipt has no top-level capture timestamp; no new date is assigned to the run. |
| Continuity and portal claims | **Retained tests:** the same proof's [continuity](/Users/grig/work/spatial-computing-research-projects-msf/repo/open-spatial-lab/evidence/wo019-crossing-proof.negative-continuity.json), [claim](/Users/grig/work/spatial-computing-research-projects-msf/repo/open-spatial-lab/evidence/wo019-crossing-proof.negative-claim.json), and [route](/Users/grig/work/spatial-computing-research-projects-msf/repo/open-spatial-lab/evidence/wo019-crossing-proof.negative-route.json) negatives fail. The positive receipt records no IWPS parameters on the wire and keeps IWPS conformance false. | Matching the sequence or vocabulary of a portal protocol does not implement its wire contract. The broader standards-conformance and native-TeleportXR flags also remain false. |
| Universal Manifest | **Retained tests:** the [July 12, 2026 UM matrix receipt](/Users/grig/work/spatial-computing-research-projects-msf/repo/open-spatial-lab/evidence/um-v04-matrix-report.json) has 72 fixtures passing each of its two axes. The [July 12 HTTP proof](/Users/grig/work/spatial-computing-research-projects-msf/repo/open-spatial-lab/evidence/wo074-wow-gaps-proof.json) passes 15 manifest-origin checks. | Fixture coverage and a separately served manifest are bounded evidence. They do not certify every v0.4 implementation or every consent operation during a long-running session. The owner’s connection to this subject must remain disclosed when presenting it. |
| RP1 spatial fabric + WoW + UM | **Documented:** the [lab integration analysis](/Users/grig/work/spatial-computing-research-projects-msf/repo/open-spatial-lab/.dev/ai/reports/2026-07-23-04-38-39Z-teleportxr-wow-osl-integration-analysis.md) and [RP1 layer](/Users/grig/work/spatial-computing-research-projects-msf/repo/open-spatial-lab/docs/ecosystem/layers/rp1-spatial-fabric.md) describe a signed `.msf` subtree and a UM pointer. Engine-signature trust and identity-signature trust stay separate. A named fail-closed verifier covers the lab's boundary model. | No new RP1 verifier run or native RP1 interoperability test occurred here. `SpatialFabricSubtree`, units, up-axis and placement are declared lab extension requirements; mid-session revocation is not proven by a traversal gate. |
| GeoPose | **Retained test:** the July 12 HTTP proof passes ten opt-in Spatial-descriptor checks, including a `geoPose` field. **Documented:** [GeoPose 1.0 scope](../data/scope/geopose.md) specifies location/orientation exchange. | Field presence does not test coordinate conversion, Earth anchoring, all conformance classes or the lab's mapping to GeoPose. WoW's recorded `geo.pose` conflict remains visible in the Map. |
| TeleportXR | **Documented:** the [September 10 trace](../data/scope/teleportxr.md) describes its server-owned streaming/session protocol and avatar signaling. | It was **not** embedded or called by the retained OSL attempt; [OSL's claim boundary](/Users/grig/work/spatial-computing-research-projects-msf/repo/open-spatial-lab/docs/ecosystem/layers/open-spatial-lab.md) is explicit. The current trace remains partial because the indexed avatar-manifest chapter returned 404. Signaling text cannot reconstruct it. |

The [July 23 conformance receipt](/Users/grig/work/spatial-computing-research-projects-msf/repo/open-spatial-lab/evidence/wow-conformance.json) records `ok: true` for its declared contract while preserving noncanonical flat-node representation and other divergences. That newer receipt corrects stale prose in the July layer summary; it still does not claim whole-standard conformance. [Retained receipt metadata](../../.dev/ai/reports/2026-09-11-00-25-26Z-early-map-delivery/retained-combination-receipts.json) records the exact hashes and outcomes inspected here.

## The twelve engine parts, at useful granularity

Build/connect below follows the existing capability export. A `connect` label identifies when agreement is needed; it does not assert that any renderer or module is dynamically swappable.

| Original part | Current subquestions and choice time | Overlap and the remaining seam |
|---|---|---|
| 1. Renderer | `render.raster`, `render.gpu-api`, `render.material` — build; `render.lod` — connect | [Three.js scope](../data/scope/threejs.md) documents renderers and detail selection. The retained lab test builds a Three.js scene; it does not choose a new renderer on connection or test final pixels. Remote rendered views remain a held proposal. |
| 2. Scene/world model | `scene.graph`, `scene.transform`, `scene.compose`, `scene.units` — build; `geo.pose`, `geo.crs` — build | WoW records, Three.js objects and RP1 `.msf` subtrees meet through a declared adapter/extension. The nested-versus-flat-node divergence and explicit units/up-axis show where they do not simply match. GeoPose does not perform arbitrary frame resolution. |
| 3. Asset pipeline | `scene.container`, `scene.geometry`, `scene.texture`, `scene.material-x`, `scene.animation` — build; `deliver.cdn` — connect | The retained HTTP proof checks content negotiation across 21 media types. It does not render all 21. [Three.js](../data/scope/threejs.md), [Unreal](../data/scope/unreal.md), glTF/VRM and the existing Map separate import, conversion and supported behavior. |
| 4. Physics/simulation | `physics.rigid`, `physics.collision`, `physics.joint` — build; `physics.determinism` — connect | [X3D scope](../data/scope/x3d.md) and engine traces document concrete physics surfaces. No combined-physics runtime receipt was inspected in OSL; exchanging parameters does not ensure deterministic outcomes. |
| 5. Logic/scripting | `logic.script`, `logic.behaviour`, `logic.sandbox`, `logic.budget` — build; `logic.namespace` — connect | [Verse scope](../data/scope/verse.md) separates language semantics from Fortnite/UEFN host libraries. Neither that documentation nor OSL's JavaScript proves portable guest code across these stacks. Parked language rows remain parked. |
| 6. Networking/replication | `net.transport`, `net.replication`, `net.session`, `net.handoff`, `net.presence` — connect | OSL proves one local continuity crossing; TeleportXR describes a different live transport. Same-machine presence, a boundary receipt and cross-operator federation are different levels of evidence. |
| 7. Audio | `audio.source`, `audio.room` — build; `audio.stream`, `audio.voice` — connect | Three.js documents positioned sources; TeleportXR documents streamed audio. X3D/MPEG cover standardization questions. No retained combined audio/voice interoperability test is claimed here. |
| 8. Input/device | `input.session`, `input.controller`, `input.hand`, `input.eye`, `input.devcaps` — connect | OpenXR/WebXR and [Three.js scope](../data/scope/threejs.md) describe different API/host boundaries. A device capability query does not negotiate arbitrary content, pose conventions or interchangeable engine clients. |
| 9. User interface | `render.text` — build; `input.controller` — connect | Glyph display and input do not define UI layout. `render.ui` is a reviewed proposal, absent from the current export. The old plane's UI question therefore remains explicit without adding a row here. |
| 10. Persistence | `persist.world`, `persist.inventory`, `persist.prefs` — connect; `persist.content-addr` — build | The local crossing observes continuity in destination state; UM describes portable context. Neither proves general database, inventory, progression or preference portability between all platforms. |
| 11. Packaging/distribution | `deliver.bundle`, `deliver.version`, `deliver.conformance` — build; `deliver.cdn` — connect | Format loaders, signed fabric files and manifest publication meet at retrieval boundaries. Valid signatures, successful packaging and a test suite answer different questions. |
| 12. Editor/authoring | `capture.edit`, `scene.compose` — build; other editor ergonomics outside present comparison | [Unity](../data/scope/unity.md), [Unreal](../data/scope/unreal.md) and [Godot](../data/scope/godot.md) traces add documented depth. Their editor inventories do not establish editor interchange; no new editor umbrella or renderer is required. |

## Verse and the platform boundary

All entries below reuse September 7–10 source traces. “Complete” describes the declared source inventory, not current service availability or product conformance. These platforms were not participants in the retained OSL crossing.

| Subject | Relevant source treatment | Material limit |
|---|---|---|
| [Verse](../data/scope/verse.md) | Language book plus published API modules; logic, namespace and persistence questions. | The Map's language-only coverage and the wider host-API trace have different boundaries. Do not silently rescore one as the other. |
| [Fortnite Creative / UEFN](../data/scope/fortnite.md) | Complete selected feature/device inventories; host-specific Verse surface. | Whole-site index remains partial because the global hierarchy request failed. Documentation revision is not a runtime version claim. |
| [Roblox](../data/scope/roblox.md) | Complete selected Creator Hub, Engine API and Open Cloud inventories. | Internal replication, Luau, OAuth and platform IDs do not establish cross-operator world interoperability. |
| [VRChat](../data/scope/vrchat.md) | Complete selected creator-documentation tree, including Udon, avatars, networking and persistence. | SDK/editor, uploaded world and hosted platform are distinct; persistence by account per world is not general cross-world transfer. |
| [Rec Room](../data/scope/recroom.md) | Historical creator/Circuits documents and official shutdown/export notices. | Shutdown subject; Studio's full documentation and some archived bodies remain unavailable. Historical capabilities are not running services. |
| [Horizon Worlds](../data/scope/horizon.md) | Bounded official historical feature-table supplements. | Current documentation/API bodies were unavailable even where HTTP returned 200; complete present scope is not established. |
| [Resonite](../data/scope/resonite.md) | Complete selected official-domain wiki indexes and direct feature areas. | The publisher identifies missing component documentation. Wiki descriptions, host plugins and portable protocols remain distinct. |

## Current Map comparison

The matrix already compares subjects against detailed capability rows and carries build/connect filters, a must-interoperate lens and diagram mode. The atlas is the current landing page. [The accepted boundary result](../../.dev/ai/subtask-comms/2026-09-04-21-42-57Z-wo-064-boundaries-result.md) supplies the implementation receipt; [ROADMAP.md](../model/ROADMAP.md) records the successor direction. The 117-row export was inspected for this crosswalk; the old twelve chips are not the remaining implementation task.

The following small comparison is copied from the current local export, not newly scored. Every populated cell retains its recorded confidence in the accompanying [comparison data](../../.dev/ai/reports/2026-09-11-00-25-26Z-early-map-delivery/map-overlap-extract.json). Here “no record” means no coverage entry, not “none.” A `native` level can describe one platform's internal mechanism and is not an interoperability certificate.

| Subject | Scene graph | GeoPose | Session handoff | Scripting |
|---|---|---|---|---|
| wow | conflicts / verified | conflicts / verified | partial / verified | none / verified |
| um | no record | none / verified | partial / verified | no record |
| rp1 | native / verified | none / verified | conflicts / verified | native / verified |
| teleportxr | native / verified | none / verified | none / verified | out-of-scope / verified |
| threejs | native / verified | out-of-scope / verified | no record | none / verified |
| geopose | no record | native / verified | no record | no record |
| verse | out-of-scope / verified | out-of-scope / verified | out-of-scope / verified | native / verified |
| fortnite | native / verified | out-of-scope / verified | partial / verified | native / verified |
| roblox | native / verified | out-of-scope / verified | native / verified | native / verified |
| vrchat | native / verified | out-of-scope / reported | conflicts / verified | conflicts / verified |
| recroom | native / verified | out-of-scope / reported | no record | native / verified |
| horizon | native / verified | out-of-scope / verified | conflicts / verified | partial / verified |
| resonite | native / verified | out-of-scope / verified | partial / verified | partial / verified |

**Stop-early disposition:** the overlap table is the delivered artifact for the original engine-plane request. Reuse the current matrix/atlas and accepted detailed source traces. Keep `render.remote`, `render.ui` and every other pending or owner-parked proposal outside the current row set until their existing acceptance process decides otherwise. No coverage, score, subject, capability, renderer or deployment changed in this work.

Next step: use the table with the current Map's evidence drawers; evaluate any remaining proposal in its existing lane.
