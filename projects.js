// Project content. Edit here; projects.html renders this list.
const PROJECTS = [
  {
    "title": "Dexterous Manipulation via Embedded Posture Graphs of Hands with N-DoF",
    "meta": "Soft Robotics Lab, ETH Zürich, 2026 - present. Supervisors: Chenyu Yang, Davide Liconti, Prof Dr Robert Katzschmann",
    "paragraphs": [
      "Building a co-embedded graph of hand postures across end effectors with differing morphology and degrees of freedom, for generalized posture mapping. Our method captures posture connections and enables representation learning via a nonlinear manifold, learning a shared representation across hands.",
      "The embedding acts as input to train a neural cross-embodiment retargeter between N-DoF hands, and as a compact posture representation for improved sample efficiency in RL-based and other downstream tasks."
    ],
    "figures": [],
    "links": [],
    "short": "Dexterous Manipulation",
    "viz": {
    "type": "orbit"
  },
    "links_label": "Stack"
  },
  {
    "title": "Vision-Language-Action Models for Pick-and-Place",
    "meta": "ETH Zürich, 2026",
    "paragraphs": [
      "Fine-tuned SmolVLA, π0, π0.5, OpenVLA and FlowerVLA on LeRobot teleoperation demonstrations to sort objects into color-matched bowls, and to place objects on photos of out-of-distribution celebrities."
    ],
    "figures": [],
    "links": [
      {
        "name": "LeRobot",
        "url": "https://github.com/huggingface/lerobot"
      },
      {
        "name": "SmolVLA",
        "url": "https://huggingface.co/lerobot/smolvla_base"
      },
      {
        "name": "π0 / π0.5",
        "url": "https://github.com/Physical-Intelligence/openpi"
      },
      {
        "name": "OpenVLA",
        "url": "https://github.com/openvla/openvla"
      },
      {
        "name": "FlowerVLA",
        "url": null
      }
    ],
    "short": "Vision-Language-Action Models",
    "viz": {
    "type": "sort"
  },
    "links_label": "Stack"
  },
  {
    "title": "NAICS-Aware Graph Neural Networks for Large-Scale POI Co-visitation Prediction",
    "meta": "Intelmatix Labs, MIT, PSU, 2024 - 2025. Collaborators: Yazeed Alrubyli, Dr Omar Alomeir, Dr Abrar Wafa, Dr Hend Alrasheed, Dr Mohsen Bahrami",
    "paragraphs": [
      "A novel GraphSAGE-based architecture that integrates learnable NAICS business taxonomy embeddings with multi-modal spatial-temporal features to predict population-level co-visitation patterns between 92,486 brands across 48 US states.",
      "The model achieves a 157% improvement in R² over state-of-the-art baselines by learning business category relationships through end-to-end training on 45.3 million graph edges, enabling scalable edge regression on extremely sparse co-visitation networks."
    ],
    "figures": [],
    "links": [
      {
        "name": "arXiv:2507.19697",
        "url": "https://arxiv.org/abs/2507.19697"
      }
    ],
    "short": "NAICS-Aware Graph Neural Networks",
    "viz": {
    "type": "network"
  },
    "links_label": "Paper"
  },
  {
    "title": "Curriculum Learning for Visual Model-Based RL for Continuous Robotics Tasks",
    "meta": "Autonomous Learning and Predictive Intelligence Lab, UZH, 2025. Supervisors: Prof Dr Giorgia Ramponi",
    "paragraphs": [
      "Investigated the implications of curriculum learning on DreamerV3 training, specifically to improve convergence speed and sample efficiency. We designed and evaluated progressive training curricula across vision-based control tasks and compared performance with baseline training approaches, demonstrating conditions under which curriculum learning significantly accelerates policy convergence."
    ],
    "figures": [
      {
        "src": "assets/curriculum-learning.png",
        "alt": "Smoothed learning curves comparing curriculum training against the baseline over 800 thousand training steps"
      }
    ],
    "links": [
      {
        "name": "JAX",
        "url": "https://docs.jax.dev/en/"
      },
      {
        "name": "MuJoCo",
        "url": "https://gymnasium.farama.org/environments/mujoco/"
      },
      {
        "name": "DreamerV3",
        "url": "https://github.com/danijar/dreamerv3"
      },
      {
        "name": "FastAPI",
        "url": "https://fastapi.tiangolo.com/"
      },
      {
        "name": "Docker",
        "url": "https://www.docker.com/"
      }
    ],
    "short": "Curriculum Learning for Visual RL",
    "viz": {
      "image": "assets/curriculum-learning.png"
    },
    "links_label": "Stack"
  },
  {
    "title": "Energy-efficient Path Planning for Autonomous Drones in Inspection Tasks",
    "meta": "Robotics & Perception Group, UZH, 2025. Supervisors: Leonard Bauersfeld, Prof Dr Davide Scaramuzza",
    "paragraphs": [
      "Traditional sampling based path planning methods often struggle to accurately account for complex drone dynamics when evaluating the cost and feasibility of a path to a sampled point. Our work is based on 3D Dubins curve infused RRT*, which allows us to constrain drone dynamics through the help of 3D Dubins curved paths, while expanding the state space to include energy-related variables such as velocity and indirectly, the curvature of the turns, in order to minimize the energy expenditure of the drone for the planned path."
    ],
    "figures": [
      {
        "src": "assets/drone-energy-velocity.png",
        "alt": "Energy per unit length and power consumption as a function of velocity"
      },
      {
        "src": "assets/drone-energy-radii.png",
        "alt": "Energy consumption as a function of velocity for different turning radii"
      }
    ],
    "links": [
      {
        "name": "ROS",
        "url": "https://github.com/ros-infrastructure/www.ros.org"
      },
      {
        "name": "Agilicious",
        "url": "https://github.com/uzh-rpg/agilicious"
      },
      {
        "name": "PythonRobotics",
        "url": "https://github.com/AtsushiSakai/PythonRobotics"
      }
    ],
    "short": "Energy-efficient Drone Path Planning",
    "viz": {
    "type": "tree"
  },
    "links_label": "Stack"
  },
  {
    "title": "Visual Odometry Pipeline",
    "meta": "Robotics & Perception Group, 2024. Collaborators: Jakob Schlichting, Nicolas Schuler, Maximilian Stralz",
    "paragraphs": [
      "A monocular visual odometry pipeline which estimates the camera motion across 3 datasets (KITTI, Malaga and Parking). It consists of two main parts: Initialization and Continuous Tracking. Initial features are detected using Shi-Tomasi corner detector, features are tracked using Lucas Kanade optical flow, the poses are estimated through P3P-RANSAC, and the poses are refined using Gauss Newton optimization. The code can be found <a href=\"https://github.com/DiaHidvegi/visual-odometry\" target=\"_blank\" rel=\"noopener\">here</a>."
    ],
    "figures": [
      {
        "src": "assets/visual-odometry.jpg",
        "alt": "Visual odometry dashboard showing tracked landmarks on a street frame, landmark counts, and the global and local trajectories"
      }
    ],
    "links": [
      {
        "name": "OpenCV",
        "url": "https://github.com/opencv/opencv"
      },
      {
        "name": "NumPy",
        "url": "https://numpy.org/"
      },
      {
        "name": "SciPy",
        "url": "https://scipy.org/"
      }
    ],
    "short": "Visual Odometry",
    "viz": {
      "image": "assets/visual-odometry.jpg"
    },
    "links_label": "Stack"
  },
  {
    "title": "Knowledge Graph Retrieval-Based LLM Agent for Factual Querying",
    "meta": "UZH, 2024. Collaborators: Raffael Botschen",
    "paragraphs": [
      "A chat agent able to respond to natural language user queries based on factual information retrieved from free text documents represented in the form of multiple knowledge graphs. Relied on Llama API for prompt engineered query classification and for natural language response generation. The system generates SPARQL queries to accurately retrieve information from the knowledge graphs, and performs prior entity matching for node filtering. This approach enabled accurate, context-aware answers through structured knowledge graph retrieval while maintaining natural language interactions between the user and the agent on the frontend."
    ],
    "figures": [],
    "links": [
      {
        "name": "Ollama",
        "url": "https://github.com/ollama/ollama"
      },
      {
        "name": "NumPy",
        "url": "https://numpy.org/"
      },
      {
        "name": "SciPy",
        "url": "https://scipy.org/"
      },
      {
        "name": "RDFLib",
        "url": "https://rdflib.readthedocs.io"
      },
      {
        "name": "SPARQL",
        "url": "https://www.w3.org/TR/sparql11-query/"
      }
    ],
    "short": "Knowledge Graph LLM Agent",
    "viz": {
    "type": "walker"
  },
    "links_label": "Stack"
  },
  {
    "title": "Vision-based Traffic Surveillance",
    "meta": "Intelmatix, 2026 - present",
    "paragraphs": [
      "Object detection and multi-object tracking models for vision-based traffic surveillance, running on live camera streams.",
      "Details are limited as this is ongoing company work."
    ],
    "figures": [],
    "links_label": "Stack",
    "links": [
      {
        "name": "RF-DETR",
        "url": "https://github.com/roboflow/rf-detr"
      },
      {
        "name": "YOLO26",
        "url": "https://docs.ultralytics.com/models/yolo26/"
      },
      {
        "name": "DeepStream",
        "url": "https://developer.nvidia.com/deepstream-sdk"
      }
    ],
    "short": "Traffic Surveillance",
    "viz": {
      "type": "traffic"
    }
  },
  {
    "title": "Geospatial Site Selection Engine",
    "meta": "Intelmatix, 2022 - present",
    "paragraphs": [
      "A location intelligence engine that models the urban dynamics of a city to perform tasks such as real estate valuation or site selection for a new QSR branch. Relying on a graph-based saturation model, a branch cannibalization model, accessibility scoring for POIs and demographic groups, route optimization, and a catchment model, it can predict the future sales for unknown locations and recommend the highest-impact site for a new branch to open within the city.",
      "The value prediction model receives inputs such as accessibility scores, market saturation, cannibalization score calculated based on the catchment of a location and its road network around it, and several demographic variables. This value prediction model can be trained to predict outputs such as future sales for a site, or the value of a land or real estate. Thanks to this flexibility on the target variable, the site selection engine can be scaled to several use cases that relate to urban and geospatial analytics."
    ],
    "figures": [
      {
        "src": "assets/accessibility-heatmap.png",
        "alt": "Heatmap of accessibility scores for 853 parcels zoned for restaurants"
      },
      {
        "src": "assets/accessibility-distance.png",
        "alt": "Accessibility score for Saudi females aged 20 to 35 from their work locations to a fast food branch in Riyadh, plotted against distance"
      }
    ],
    "links": [
      {
        "name": "PyTorch",
        "url": "https://pytorch.org/"
      },
      {
        "name": "scikit-learn",
        "url": "https://scikit-learn.org/"
      },
      {
        "name": "NumPy",
        "url": "https://numpy.org/"
      },
      {
        "name": "FastAPI",
        "url": "https://fastapi.tiangolo.com/"
      },
      {
        "name": "Docker",
        "url": "https://www.docker.com/"
      },
      {
        "name": "AWS S3",
        "url": "https://aws.amazon.com/s3/"
      }
    ],
    "short": "Geospatial Site Selection",
    "viz": {
      "image": "assets/accessibility-heatmap.png"
    },
    "links_label": "Stack"
  },
  {
    "title": "Healthcare Agent-based Policy Simulator with Learned Action Functions",
    "meta": "Intelmatix, 2022 - 2023",
    "paragraphs": [
      "A policy simulation engine that identifies the relationships between the development of the healthcare practitioner workforce in a country and various government policy changes related to immigration, medical education, workforce allocation, and employment requirements.",
      "The effect of policy changes are measured by the resulting number of practitioners per 1000 population per specialization. At the beginning of every simulation year a new trainee cohort is initialized for each specialization with particular characteristics such as demographics and university GPA. Each trainee agent acts according to their own specialization requirements and training center environment. For example, they might take various exams, decide to take a gap year, switch specializations, or perhaps abort or drop out. Eventually, the graduated trainees become senior registrars, who later may become consultants. At the end of the simulation the total workforce is captured. Healthcare practitioners are modeled as workforce agents, with their various actions being predicted through classical machine learning algorithms.",
      "The goal is to support healthcare system decision-makers in understanding the impact of potential policies and recommend them the right policy based on the national targets such as reaching a certain number of registered nurses or improving healthcare training quality."
    ],
    "figures": [],
    "links": [
      {
        "name": "Mesa",
        "url": "https://mesa.readthedocs.io"
      },
      {
        "name": "FastAPI",
        "url": "https://fastapi.tiangolo.com/"
      },
      {
        "name": "Docker",
        "url": "https://www.docker.com/"
      },
      {
        "name": "AWS S3",
        "url": "https://aws.amazon.com/s3/"
      }
    ],
    "short": "Healthcare Policy Simulator",
    "viz": {
    "type": "agents"
  },
    "links_label": "Stack"
  },
  {
    "title": "Unstructured Financial Data Extractor",
    "meta": "Dealogic, 2021 - 2022",
    "paragraphs": [
      "A data wrangling and extraction engine that relies on various NLP methods such as named-entity recognition, sentiment analysis, and text mining in order to extract highly accurate financial data from unstructured sources like free text, PDFs, and legal documents published by the US Stock Exchange Commission.",
      "The goal of the project was to build a graph database to store the relationships of special purpose acquisition companies (SPACs), their acquired companies, their sponsors and sponsor affiliates, as well as all involved individuals' connections to these entities. In addition to capturing such relationships, we also wanted to collect additional information about the entities themselves, such as stock and warrant prices, ticker symbols and stock exchanges, purchase conditions and warrant expiry dates, etc.",
      "The raw filings are collected and the data points are extracted near real-time, with minimal delay after publication on SEC. A NER model was trained on historical SEC documents, and it is able to process and extract data from various filing types such as 424B4, S10, quarterly and annual reports."
    ],
    "figures": [],
    "links": [],
    "short": "Financial Data Extractor",
    "viz": {
    "type": "stream"
  },
    "links_label": "Stack"
  },
  {
    "title": "Automated Credit Underwriting Algorithm",
    "meta": "Anyfin, 2019 - 2020",
    "paragraphs": [
      "A credit underwriting algorithm that takes in a loan applicant profile as an input, makes a decision on whether or not to offer them an option to refinance their loan. If an offer is made, the algorithm also recommends the optimal interest rate to the applicant based on an internal credit scoring model, their probability of default, payment history, previous loan applications, and other variables.",
      "My most significant contribution to this algorithm was the improvement of our default prediction model by developing a new feature scoring method that relied on the apriori algorithm, weight of evidence and information value statistics."
    ],
    "figures": [],
    "links": [],
    "short": "Credit Underwriting",
    "viz": {
    "type": "gate"
  },
    "links_label": "Stack"
  }
];
